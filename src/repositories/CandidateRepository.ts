/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candidate, Skill, SkillLevel } from "../types";

export interface SearchParams {
  query?: string;
  location?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  minAtsScore?: number;
  minExperienceYears?: number;
  skills?: string[];
  page?: number;
  limit?: number;
  sortBy?: "ats_score_desc" | "salary_asc" | "salary_desc" | "name_asc";
}

export interface SearchResult {
  success: boolean;
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: Candidate[];
  error?: string;
}

export interface ICandidateRepository {
  search(params: SearchParams, recruiterId: string, subscriptionTier: string): Promise<SearchResult>;
  toggleBookmark(recruiterId: string, candidateId: string): Promise<string[]>;
  getBookmarks(recruiterId: string): Promise<string[]>;
  getSkillsTaxonomy(): Promise<string[]>;
}

/**
 * CandidateRepository handles high-performance candidate sourcing queries.
 * Following the strict Repository Pattern, it isolates data-access operations,
 * applies validation checks, handles candidate PII privacy masking, and models permissions.
 */
export class CandidateRepository implements ICandidateRepository {
  private candidates: Candidate[];
  private bookmarks: Map<string, string[]> = new Map(); // recruiterId -> candidateIds[]
  private searchCountHistory: Map<string, { timestamp: number; count: number }> = new Map();

  // Simulated DB connection status
  private static isDbOnline: boolean = true;

  constructor(initialCandidates: Candidate[]) {
    this.candidates = JSON.parse(JSON.stringify(initialCandidates)); // deep copy to prevent mutation
  }

  /**
   * Toggles database connection simulation for error recovery testing
   */
  public static setDbOnline(online: boolean) {
    this.isDbOnline = online;
  }

  /**
   * Sourcing search query with strict input validation, rate limiting, and candidate PII security masking.
   */
  public async search(
    params: SearchParams,
    recruiterId: string,
    subscriptionTier: string
  ): Promise<SearchResult> {
    // 1. Database Connection Check (System Robustness & Error Handling)
    if (!CandidateRepository.isDbOnline) {
      return {
        success: false,
        meta: { totalCount: 0, totalPages: 0, currentPage: 1, limit: 10 },
        data: [],
        error: "Our discovery engine is undergoing rapid database synchronization. Please reload in 5 seconds."
      };
    }

    // 2. Security & Rate-Limiting Check (Anti-Scraping / Security Blueprint)
    const rateLimitError = this.checkRateLimit(recruiterId, subscriptionTier);
    if (rateLimitError) {
      return {
        success: false,
        meta: { totalCount: 0, totalPages: 0, currentPage: 1, limit: 10 },
        data: [],
        error: rateLimitError
      };
    }

    // 3. Validation Check (Strict Input Constraints / Zod-like runtime rules)
    const validationError = this.validateSearchParams(params);
    if (validationError) {
      return {
        success: false,
        meta: { totalCount: 0, totalPages: 0, currentPage: 1, limit: 10 },
        data: [],
        error: validationError
      };
    }

    // Defaults
    const query = params.query?.trim().toLowerCase() || "";
    const location = params.location?.trim().toLowerCase() || "";
    const isRemote = params.isRemote !== undefined ? params.isRemote : null;
    const salaryMin = params.salaryMin ?? 0;
    const salaryMax = params.salaryMax ?? 1000000000;
    const minAtsScore = params.minAtsScore ?? 0;
    const minExperienceYears = params.minExperienceYears ?? 0;
    const filterSkills = params.skills?.map(s => s.toLowerCase()) || [];
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.max(1, Math.min(50, params.limit ?? 10));

    // 4. Filtering Logic (Multi-Facet Sourcing Engine)
    let filtered = this.candidates.filter(cand => {
      // Fuzzy Text Query (matches Name, Headline, AboutMe, or Skill Names)
      if (query) {
        const matchesName = cand.fullName.toLowerCase().includes(query);
        const matchesHeadline = cand.headline.toLowerCase().includes(query);
        const matchesBio = cand.aboutMe.toLowerCase().includes(query);
        const matchesSkills = cand.skills.some(s => s.name.toLowerCase().includes(query));
        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkills) {
          return false;
        }
      }

      // Location Filter (Fuzzy Trigram Simulator)
      if (location) {
        const matchesLoc = cand.location.toLowerCase().includes(location) || 
                           cand.preferredLocation.toLowerCase().includes(location);
        if (!matchesLoc) return false;
      }

      // Remote Filter
      if (isRemote !== null && isRemote && !cand.remote) {
        return false;
      }

      // Experience Check
      if (minExperienceYears > 0) {
        const maxExp = Math.max(
          0,
          ...cand.skills.map(s => s.yearsOfExperience),
          ...cand.experience.map(() => 1)
        );
        if (maxExp < minExperienceYears) {
          return false;
        }
      }

      // ATS Score minimum threshold check
      if (cand.atsScore < minAtsScore) {
        return false;
      }

      // Skills taxonomy junction mapping
      if (filterSkills.length > 0) {
        const hasAllSkills = filterSkills.every(reqSkill =>
          cand.skills.some(s => s.name.toLowerCase().includes(reqSkill))
        );
        if (!hasAllSkills) return false;
      }

      // Compensation matching
      // Parses expected compensation string "$135,000 / year" into numeric value
      const candSalary = this.parseSalaryNumeric(cand.expectedSalary);
      if (candSalary < salaryMin || candSalary > salaryMax) {
        return false;
      }

      return true;
    });

    // 5. Sorting Engine
    const sortBy = params.sortBy ?? "ats_score_desc";
    filtered.sort((a, b) => {
      if (sortBy === "ats_score_desc") {
        return b.atsScore - a.atsScore;
      } else if (sortBy === "salary_asc") {
        return this.parseSalaryNumeric(a.expectedSalary) - this.parseSalaryNumeric(b.expectedSalary);
      } else if (sortBy === "salary_desc") {
        return this.parseSalaryNumeric(b.expectedSalary) - this.parseSalaryNumeric(a.expectedSalary);
      } else if (sortBy === "name_asc") {
        return a.fullName.localeCompare(b.fullName);
      }
      return 0;
    });

    // 6. Pagination Calculations
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const activePage = page > totalPages ? totalPages : page; // Overflow fallback
    const startIndex = (activePage - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // 7. Security Blueprint: Candidate Privacy Protection (Field-level PII Masking)
    // We mask raw candidate email/phone inside search listings to protect PII.
    // In production, these fields are decrypted only upon a Sourcing Pitch being accepted.
    const securedData = paginated.map(cand => {
      const securedCand = { ...cand };
      securedCand.email = this.maskEmail(cand.email);
      securedCand.phone = this.maskPhone(cand.phone);
      return securedCand;
    });

    return {
      success: true,
      meta: {
        totalCount,
        totalPages,
        currentPage: activePage,
        limit
      },
      data: securedData
    };
  }

  /**
   * Manages bookmarked candidates for recruiters.
   */
  public async toggleBookmark(recruiterId: string, candidateId: string): Promise<string[]> {
    if (!CandidateRepository.isDbOnline) {
      throw new Error("Repository is offline");
    }
    const res = await fetch("/api/recruiters/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId })
    });
    if (!res.ok) {
      throw new Error("Failed to toggle bookmark");
    }
    const data = await res.json();
    return data.savedCandidateIds || [];
  }

  public async getBookmarks(recruiterId: string): Promise<string[]> {
    try {
      const res = await fetch("/api/recruiters/me");
      if (res.ok) {
        const data = await res.json();
        return data.recruiter?.savedCandidateIds || [];
      }
    } catch (e) {
      console.warn("Failed to fetch bookmarks from backend", e);
    }
    return [];
  }

  /**
   * Retrieves unique skills list across all candidates.
   */
  public async getSkillsTaxonomy(): Promise<string[]> {
    const skillNames = new Set<string>();
    this.candidates.forEach(c => {
      c.skills.forEach(s => skillNames.add(s.name));
    });
    return Array.from(skillNames).sort();
  }

  // -------------------------------------------------------------
  // PRIVATE SECURITY & VALIDATION UTILITIES
  // -------------------------------------------------------------

  /**
   * Parses string expectedSalary (e.g. "$135,000 / year") to number (135000)
   */
  private parseSalaryNumeric(salaryStr: string): number {
    const cleaned = salaryStr.replace(/[^0-9]/g, "");
    const value = parseInt(cleaned, 10);
    return isNaN(value) ? 0 : value;
  }

  /**
   * Zod-like runtime schema validation of parameters
   */
  private validateSearchParams(params: SearchParams): string | null {
    if (params.query && params.query.length > 100) {
      return "Query exceeds maximum limit of 100 characters.";
    }
    if (params.location && params.location.length > 100) {
      return "Location input exceeds maximum limit of 100 characters.";
    }
    if (params.salaryMin !== undefined && params.salaryMin < 0) {
      return "Minimum salary threshold cannot be a negative value.";
    }
    if (
      params.salaryMin !== undefined &&
      params.salaryMax !== undefined &&
      params.salaryMin > params.salaryMax
    ) {
      return "Invalid criteria: Minimum salary filter cannot be greater than the maximum filter.";
    }
    if (params.minAtsScore !== undefined && (params.minAtsScore < 0 || params.minAtsScore > 100)) {
      return "ATS match score constraints must lie strictly between 0 and 100%.";
    }
    return null;
  }

  /**
   * Implements strict role-based search throttling (Rate Limiting)
   */
  private checkRateLimit(recruiterId: string, subscriptionTier: string): string | null {
    // [PAID_FEATURE_TOGGLE] In Free Trial mode, search throttling is disabled for all users.
    // Uncomment the line below to restore subscription-based rate limits:
    // const limitMax = subscriptionTier === "Enterprise" ? 120 : subscriptionTier === "Premium" ? 60 : 20;
    const limitMax = 99999; // Free trial: unrestricted candidate sourcing
    const now = Date.now();
    const tracker = this.searchCountHistory.get(recruiterId);

    if (!tracker || now - tracker.timestamp > 60000) {
      // First search or reset interval
      this.searchCountHistory.set(recruiterId, { timestamp: now, count: 1 });
      return null;
    }

    if (tracker.count >= limitMax) {
      return `Rate limit exceeded (429 Too Many Requests). Your current subscription tier (${subscriptionTier}) limits you to ${limitMax} queries per minute to protect profile parsing.`;
    }

    tracker.count += 1;
    return null;
  }

  /**
   * Security masking utility for candidate personal emails
   */
  private maskEmail(email: string): string {
    const parts = email.split("@");
    if (parts.length !== 2) return "********@example.com";
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) {
      return `*@${domain} (Locked until Pitch accepted)`;
    }
    return `${name.substring(0, 2)}****@${domain} (Locked until Pitch accepted)`;
  }

  /**
   * Security masking utility for candidate phone numbers
   */
  private maskPhone(phone: string): string {
    if (phone.length <= 4) return "****";
    return `+* (***) ***-${phone.substring(phone.length - 4)} (Locked)`;
  }
}
