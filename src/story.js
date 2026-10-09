import { createHash } from 'node:crypto';

function plainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function canonicalJson(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('NON_FINITE_NUMBER');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
  if (!plainObject(value)) throw new TypeError('UNSUPPORTED_JSON_VALUE');
  const keys = Object.keys(value).sort();
  return '{' + keys.map(key => JSON.stringify(key) + ':' + canonicalJson(value[key])).join(',') + '}';
}
export function digestOf(value) {
  return createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
}

function snapshot(value) {
  return JSON.parse(canonicalJson(value));
}

export class StoryRepository {
  #projects = new Map();

  create(projectId, content) {
    if (typeof projectId !== 'string' || !projectId.trim()) throw new Error('INVALID_PROJECT_ID');
    if (!plainObject(content)) throw new Error('INVALID_STORY_CONTENT');
    if (this.#projects.has(projectId)) throw new Error('PROJECT_ALREADY_EXISTS');
    const revision = this.#record(projectId, 1, null, content);
    this.#projects.set(projectId, [revision]);
    return snapshot(revision);
  }

  current(projectId) {
    const versions = this.#projects.get(projectId);
    if (!versions) throw new Error('UNKNOWN_PROJECT');
    return snapshot(versions.at(-1));
  }

  history(projectId) {
    const versions = this.#projects.get(projectId);
    if (!versions) throw new Error('UNKNOWN_PROJECT');
    return snapshot(versions);
  }

  propose(projectId, baseRevision, baseDigest, proposedContent, reason) {
    const current = this.current(projectId);
    if (current.revision !== baseRevision || current.digest !== baseDigest) throw new Error('STALE_BASE_REVISION');
    if (!plainObject(proposedContent)) throw new Error('INVALID_STORY_CONTENT');
    if (!reason || !reason.trim()) throw new Error('MISSING_CHANGE_REASON');
    return snapshot({
      type: 'CHANGE_PROPOSAL', projectId, baseRevision, baseDigest,
      proposedContent: snapshot(proposedContent), proposedDigest: digestOf(proposedContent),
      reason, status: 'PENDING_REVIEW', productionApproved: false
    });
  }

  acceptReviewedProposal(proposal, review) {
    if (proposal?.type !== 'CHANGE_PROPOSAL' || proposal.status !== 'PENDING_REVIEW') throw new Error('INVALID_PROPOSAL');
    const current = this.current(proposal.projectId);
    if (current.revision !== proposal.baseRevision || current.digest !== proposal.baseDigest) throw new Error('STALE_BASE_REVISION');
    if (digestOf(proposal.proposedContent) !== proposal.proposedDigest) throw new Error('PROPOSAL_TAMPERED');
    if (review?.decision !== 'PASS' || review.proposalDigest !== proposal.proposedDigest) throw new Error('REVIEW_REQUIRED');
    const next = this.#record(proposal.projectId, current.revision + 1, current.digest, proposal.proposedContent);
    this.#projects.get(proposal.projectId).push(next);
    return snapshot(next);
  }

  #record(projectId, revision, parentDigest, content) {
    const data = snapshot(content);
    return { projectId, revision, parentDigest, digest: digestOf({ projectId, revision, parentDigest, content: data }), content: data, productionApproved: false };
  }
}

// Pure data model only. A PASS review allows creation of a new non-production draft
// revision, never an authenticated production approval.
export const PRODUCTION_GATE = Object.freeze({ enabled: false, reason: 'AUTHENTICATED_HUMAN_APPROVAL_NOT_IMPLEMENTED' });
