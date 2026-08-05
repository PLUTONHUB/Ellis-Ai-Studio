function randomToken(length = 64) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let token = '';
  for (let i = 0; i < length; i += 1) token += alphabet[Math.floor(Math.random() * alphabet.length)];
  return token;
}
const item = $input.first().json;
const issuedAt = Date.now();
const expiresAt = issuedAt + 7 * 24 * 60 * 60 * 1000;
const approvalToken = randomToken();
const store = $getWorkflowStaticData('global');
store.approvals = store.approvals || {};
store.content = store.content || {};
store.approvals[approvalToken] = { contentId:item.contentId, caption:item.linkedinDraft, issuedAt, expiresAt, status:'pending', used:false };
store.content[item.contentId] = { ...(store.content[item.contentId] || {}), status:'awaiting_approval', finalCaption:item.linkedinDraft };
const base = 'https://ellisaistudio.app.n8n.cloud';
return [{ json:{ ...item, approvalTokenIssuedAt:issuedAt, approvalTokenExpiresAt:expiresAt, approvalTokenUsed:false, approveUrl:base+'/webhook/ellis-content-approve?token='+encodeURIComponent(approvalToken), rejectUrl:base+'/webhook/ellis-content-reject?token='+encodeURIComponent(approvalToken), revisionUrl:base+'/webhook/ellis-content-revision?token='+encodeURIComponent(approvalToken) } }];
