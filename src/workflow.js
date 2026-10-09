export const SCOPES = Object.freeze([
  'idea', 'outline_only', 'outline_review', 'script_review',
  'existing_script_storyboard', 'shot_prompt_only', 'full_production'
]);

export function routeRequest({ scope, hasIdea = false, hasOutline = false, hasScript = false, hasShot = false, storyApproved = false } = {}) {
  if (!SCOPES.includes(scope)) return { ok: false, blocker: 'UNKNOWN_SCOPE' };
  const blockers = {
    outline_only: hasIdea || hasOutline ? null : 'MISSING_IDEA_OR_OUTLINE',
    outline_review: hasOutline ? null : 'MISSING_OUTLINE',
    script_review: hasScript ? null : 'MISSING_SCRIPT',
    existing_script_storyboard: hasScript ? null : 'MISSING_SCRIPT',
    shot_prompt_only: hasShot ? null : 'MISSING_SHOT',
    full_production: storyApproved ? 'AUTHENTICATED_APPROVAL_NOT_IMPLEMENTED' : 'STORY_NOT_AUTHENTICATED_AND_APPROVED'
  };
  const blocker = blockers[scope] ?? (scope === 'idea' && !hasIdea ? 'MISSING_IDEA' : null);
  if (blocker) return { ok: false, scope, blocker };
  const routes = {
    idea: ['interview', 'direction_options'],
    outline_only: ['intake', 'story_outline'],
    outline_review: ['outline_diagnosis'],
    script_review: ['script_diagnosis'],
    existing_script_storyboard: ['scoped_director_draft'],
    shot_prompt_only: ['prompt_revision', 'prompt_qa']
  };
  return { ok: true, scope, stages: routes[scope], productionAuthorized: false };
}
