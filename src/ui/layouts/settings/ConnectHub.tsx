import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  Box,
  FlexBox,
  FormTextField,
  GhostButton,
  Paragraph,
  PrimaryButton,
  TextButton,
} from '../../components';

import { BASE_API_URL, HUB_API_URL } from '../../../api/constants';
import { Popup } from '../common/Popup';
import {
  authoriseHubActionTypes,
  disconnectHubActionTypes,
} from '../../../redux/actionTypes';
import GitHubLogo from '../../assets/GitHub_Logo.png';
import { useAuthToken, useHubToken } from '../../hooks/auth';
import { useToaster } from '../../hooks';
import { userSelectors } from '../../../redux/selectors';

const getGitHubRedirectURL = () =>
  axios.get(`${HUB_API_URL}/auth/github/authorize`);

const updateTokenInServer = (
  userId: string,
  hubToken: string | null,
  authToken: string,
) => {
  axios
    .put(
      `${BASE_API_URL}/users/${userId}`,
      {
        hub_token: hubToken,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )
    // if persisting to the server fails then better to still let the user use the Hub connection on the frontend;
    .catch(console.error);
};

export const ConnectHub: React.FC = () => {
  const [token, setToken] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  // const authToken = useSelector(sessionSelectors.authenticationToken);
  const dispatch = useDispatch();
  const hubIsConnected = !!useHubToken();
  const authToken = useAuthToken();
  const { successToast } = useToaster();
  const myUser = useSelector(userSelectors.myUser);

  return hubIsConnected ? (
    <FlexBox flexDirection="column" alignItems="end">
      <Paragraph>Connected Hub via</Paragraph>
      <Box style={{ marginLeft: 'auto' }} marginBottom="sm">
        <img src={GitHubLogo} alt="GitHub" width="100px" />
      </Box>
      <TextButton
        onClick={() => {
          dispatch({ type: disconnectHubActionTypes.success });
          successToast({ description: 'Disconnected from Hub' });

          if (authToken && myUser) {
            updateTokenInServer(myUser.id, null, authToken);
          }
        }}
      >
        Disconnect Hub
      </TextButton>
    </FlexBox>
  ) : (
    <>
      <FlexBox justifyContent="end">
        <GhostButton
          onClick={() => {
            window.open('https://docs.zenml.io', '_blank');
          }}
          style={{ marginLeft: 'auto', marginRight: '12px' }}
        >
          What is Hub?
        </GhostButton>

        <PrimaryButton
          onClick={async () => {
            const { data } = await getGitHubRedirectURL();
            setPopupOpen(true);
            window.open(data.authorization_url, '_blank');
          }}
        >
          Connect Hub
        </PrimaryButton>
      </FlexBox>

      {popupOpen && (
        <Popup onClose={() => setPopupOpen(false)}>
          <Paragraph>
            Enter the token that you got from GitHub in the input below and then
            save it.
          </Paragraph>
          <Box marginVertical="lg">
            <FormTextField
              label="GitHub token"
              value={token}
              onChange={setToken}
              placeholder="Your GitHub token"
            />
          </Box>
          <PrimaryButton
            onClick={() => {
              dispatch({
                type: authoriseHubActionTypes.success,
                payload: { access_token: token },
              });
              successToast({ description: 'Connected to Hub' });
              setPopupOpen(false);

              if (authToken && myUser) {
                updateTokenInServer(myUser.id, token, authToken);
              }
            }}
          >
            Save token
          </PrimaryButton>
        </Popup>
      )}
    </>
  );
};