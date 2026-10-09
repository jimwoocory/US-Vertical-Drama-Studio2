const TASK_MODES = new Set(['generate', 'reference', 'edit', 'extend', 'first_frame', 'first_last_frame']);

export function validateProviderTask(profile, task) {
  if (!profile || !task || typeof task !== 'object') return { ok: false, blocker: 'MISSING_PROFILE_OR_TASK' };
  if (!profile.verifiedAt || !profile.evidenceSource) return { ok: false, blocker: 'UNVERIFIED_PROVIDER_PROFILE' };
  if (!TASK_MODES.has(task.mode) || !Array.isArray(profile.supportedModes) || !profile.supportedModes.includes(task.mode)) {
    return { ok: false, blocker: 'UNSUPPORTED_TASK_MODE' };
  }
  if (!Array.isArray(task.segments) || task.segments.length === 0) return { ok: false, blocker: 'MISSING_VISIBLE_ACTIONS' };
  let previousEnd = 0;
  for (const segment of task.segments) {
    if (!Number.isFinite(segment.start) || !Number.isFinite(segment.end)
      || segment.start < 0 || segment.start >= segment.end || segment.start !== previousEnd
      || typeof segment.action !== 'string' || !segment.action.trim()) {
      return { ok: false, blocker: 'INVALID_SEGMENT' };
    }
    previousEnd = segment.end;
  }
  if (task.attachmentsVerified !== true) return { ok: false, blocker: 'MEDIA_ATTACHMENTS_UNVERIFIED' };
  return { ok: true, state: 'OFFLINE_PREFLIGHT_ONLY', apiReady: false };
}
