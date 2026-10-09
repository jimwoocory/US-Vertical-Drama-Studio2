import test from 'node:test';
import assert from 'node:assert/strict';
import { routeRequest } from '../src/workflow.js';
import { StoryRepository, canonicalJson, PRODUCTION_GATE } from '../src/story.js';
import { validateProviderTask } from '../src/provider.js';

test('outline-only stops at outline', () => {
  assert.deepEqual(routeRequest({ scope:'outline_only', hasIdea:true }).stages, ['intake','story_outline']);
});
test('prompt-only cannot trigger story rewrite', () => {
  assert.deepEqual(routeRequest({ scope:'shot_prompt_only', hasShot:true }).stages, ['prompt_revision','prompt_qa']);
  assert.equal(routeRequest({ scope:'shot_prompt_only', hasShot:false }).blocker, 'MISSING_SHOT');
});
test('full production cannot bypass authenticated approval', () => {
  assert.equal(routeRequest({ scope:'full_production', storyApproved:true }).blocker,'AUTHENTICATED_APPROVAL_NOT_IMPLEMENTED');
  assert.equal(PRODUCTION_GATE.enabled, false);
});
test('canonical JSON sorts keys consistently', () => {
  assert.equal(canonicalJson({b:2,a:1}),canonicalJson({a:1,b:2}));
  assert.throws(() => canonicalJson({x:NaN}),/NON_FINITE_NUMBER/);
});
test('story revisions immutable, caller edits do not mutate stored data', () => {
  const repo = new StoryRepository();
  const first = repo.create('p1',{characters:[{id:'C1',want:'freedom'}]});
  first.content.characters[0].want = 'overwrite';
  assert.equal(repo.current('p1').content.characters[0].want, 'freedom');
  assert.equal(repo.current('p1').revision,1);
});
test('change proposal tied to exact parent and review', () => {
  const repo = new StoryRepository();
  const v1=repo.create('p2',{ending:'A'});
  const p=repo.propose('p2',v1.revision,v1.digest,{ending:'B'},'new ending');
  assert.equal(p.productionApproved,false);
  assert.throws(()=>repo.acceptReviewedProposal(p,{decision:'PASS',proposalDigest:'wrong'}),/REVIEW_REQUIRED/);
  const v2=repo.acceptReviewedProposal(p,{decision:'PASS',proposalDigest:p.proposedDigest});
  assert.equal(v2.revision,2);
  assert.equal(v2.parentDigest,v1.digest);
  assert.equal(v2.productionApproved,false);
  assert.equal(repo.history('p2')[0].content.ending,'A');
  assert.throws(()=>repo.acceptReviewedProposal(p,{decision:'PASS',proposalDigest:p.proposedDigest}),/STALE_BASE_REVISION/);
});
test('provider requires verified capabilities and actual attachment evidence', () => {
  const profile={verifiedAt:'2026-10-09',evidenceSource:'manual test',supportedModes:['generate']};
  const task={mode:'generate',segments:[{start:0,end:5,action:'Open the door'}]};
  assert.equal(validateProviderTask({},task).blocker,'UNVERIFIED_PROVIDER_PROFILE');
  assert.equal(validateProviderTask(profile,task).blocker,'MEDIA_ATTACHMENTS_UNVERIFIED');
  assert.equal(validateProviderTask(profile,{...task,attachmentsVerified:true}).apiReady,false);
  assert.equal(validateProviderTask(profile,{...task,segments:[{start:5,end:3,action:'bad'}],attachmentsVerified:true}).blocker,'INVALID_SEGMENT');
});
