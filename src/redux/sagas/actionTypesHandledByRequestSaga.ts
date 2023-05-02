import {
  loginActionTypes,
  userActionTypes,
  organizationActionTypes,
  workspaceActionTypes,
  pipelineActionTypes,
  stackActionTypes,
  rolesActionTypes,
  stackComponentActionTypes,
  runActionTypes,
  signupActionTypes,
  forgotActionTypes,
  flavorActionTypes,
  secretActionTypes,
  repositoryActionTypes,
  serverInfoActionTypes,
} from '../actionTypes';

export const actionTypesHandledByRequestSaga: string[] = [
  loginActionTypes.request,
  signupActionTypes.request,
  forgotActionTypes.request,
  userActionTypes.getMyUser.request,
  userActionTypes.getUserForId.request,
  rolesActionTypes.getRoles.request,
  organizationActionTypes.getMyOrganization.request,
  organizationActionTypes.getInviteForCode.request,
  organizationActionTypes.getInvites.request,
  organizationActionTypes.getMembers.request,
  organizationActionTypes.invite.request,
  organizationActionTypes.deleteInvite.request,
  organizationActionTypes.retryInvoice.request,
  organizationActionTypes.invite.request,
  workspaceActionTypes.getMyWorkspaces.request,
  workspaceActionTypes.getMyWorkspaceStats.request,
  workspaceActionTypes.selectWorkspace.request,
  pipelineActionTypes.getMyPipelines.request,
  pipelineActionTypes.getPipelineForId.request,
  pipelineActionTypes.getRunsByPipelineId.request,
  stackActionTypes.getMyStacks.request,
  stackActionTypes.getStackForId.request,
  secretActionTypes.getMySecrets.request,
  secretActionTypes.getSecretForId.request,
  stackActionTypes.getRunsByStackId.request,
  flavorActionTypes.getFlavorAll.request,
  flavorActionTypes.getFlavorType.request,
  stackComponentActionTypes.getStackComponentTypes.request,
  stackComponentActionTypes.getStackComponentList.request,
  stackComponentActionTypes.getStackComponentForId.request,
  stackComponentActionTypes.getRunsByStackComponentId.request,
  runActionTypes.getAllRuns.request,
  runActionTypes.getRunForId.request,
  runActionTypes.getGraphForRunId.request,
  repositoryActionTypes.getRepositories.request,
  repositoryActionTypes.getRepositoryByID.request,
  repositoryActionTypes.getRunsByRepoID.request,
  serverInfoActionTypes.getServerInfo.request,
];
