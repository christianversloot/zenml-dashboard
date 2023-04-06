import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import {
  Box,
  FlexBox,
  Paragraph,
  icons,
  SeparatorLight,
  Tag,
  // LineChart,
  LinkBox,
  PrimaryButton,
  H3,
  FullWidthSpinner,
} from '../../../components';
import { AuthenticatedLayout } from '../../common/layouts/AuthenticatedLayout';
import { routePaths } from '../../../../routes/routePaths';
import { useSelector, useToaster } from '../../../hooks';
import { workspaceSelectors } from '../../../../redux/selectors';
import { getTranslateByScope } from '../../../../services';
import { DEFAULT_WORKSPACE_NAME, iconColors } from '../../../../constants';
// import ZenMLFavourite from './ZenML favourite.svg';
import InstallDesignHeader from './InstallDesignHeader.svg';
import { Tabs } from '../../common/Tabs';
import { DisplayMarkdown } from '../../../components/richText/DisplayMarkdown';
import { DisplayCode } from './DisplayCode';
import { Popup } from '../../common/Popup';
import { useHubToken, useHubUser } from '../../../hooks/auth';
import { PluginsLayout } from '../shared/Layout';
import {
  getPlugin,
  getIsStarred,
  getVersions,
  starPlugin,
  // deletePlugin,
} from '../api';

export const translate = getTranslateByScope('ui.layouts.Plugins.list');

const PluginDetail: React.FC = () => {
  const history = useHistory();
  const selectedWorkspace = useSelector(workspaceSelectors.selectedWorkspace);
  const { successToast, failureToast } = useToaster();
  const { pluginId } = useParams<{ pluginId: string }>();
  const hubToken = useHubToken();
  const hubUser = useHubUser();

  // const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [plugin, setPlugin] = useState(null as null | TPlugin);
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [versions, setVersions] = useState(null as null | TPlugin[]);
  const [starred, setIsStarred] = useState(false);

  const isOwner = hubUser?.id === plugin?.user.id;
  const installCommand = plugin
    ? `zenml hub install ${plugin.user.username}/${plugin.name}:${plugin.version}`
    : '';

  useEffect(() => {
    getPlugin(pluginId).then((p) => {
      setPlugin(p);
      setFetching(false);
      getVersions(p.name, p.user.id)
        .then(setVersions)
        .finally(() => setLoadingVersions(false));
    });
  }, [pluginId]);
  useEffect(() => {
    if (hubUser && hubToken) {
      getIsStarred(hubUser.id, pluginId, hubToken).then(setIsStarred);
    }
  }, [pluginId, hubUser, hubToken]);

  return (
    <AuthenticatedLayout
      breadcrumb={[
        {
          name: 'List plugins',
          clickable: true,
          to: routePaths.plugins.list(
            selectedWorkspace ?? DEFAULT_WORKSPACE_NAME,
          ),
        },

        {
          name: 'Plugin details',
          clickable: true,
          to: routePaths.plugins.detail.overview(
            selectedWorkspace ?? DEFAULT_WORKSPACE_NAME,
            pluginId,
          ),
        },
      ]}
    >
      {fetching ? (
        <FullWidthSpinner color="black" size="md" />
      ) : (
        plugin && (
          <PluginsLayout title="Plugin Details">
            {/* content */}
            <FlexBox fullWidth>
              {/* left column */}
              <FlexBox flexDirection="column" fullWidth padding="lg">
                {/* tags */}
                <FlexBox fullWidth marginBottom="sm" flexWrap>
                  {plugin.tags.map((t) => (
                    <Box marginRight="sm" key={t}>
                      <Tag text={t} />
                    </Box>
                  ))}
                </FlexBox>
                {/* header info */}
                <FlexBox marginVertical="lg">
                  {/* image */}
                  <Box
                    style={{
                      borderRadius: '5px',
                      border: '1px solid #A8A8A880',
                      padding: '10px',
                    }}
                  >
                    <Box
                      style={{
                        width: '132px',
                        height: '132px',
                        backgroundColor: '#eee',
                      }}
                    ></Box>
                  </Box>

                  <Box marginLeft="lg">
                    {/* title */}
                    <FlexBox alignItems="center">
                      <Paragraph
                        style={{ fontSize: '32px', marginRight: '8px' }}
                        color="primary"
                      >
                        {plugin.name}
                      </Paragraph>

                      <icons.verified color={iconColors.primary} size="lg" />
                    </FlexBox>

                    {/* light details */}
                    <FlexBox marginVertical="md">
                      <Paragraph
                        size="tiny"
                        color="grey"
                        style={{ marginRight: '12px' }}
                      >
                        Latest Version {plugin.version}
                      </Paragraph>
                      <Paragraph size="tiny" color="grey">
                        Published {moment(plugin.created).fromNow()}
                      </Paragraph>
                    </FlexBox>

                    {/* actions */}
                    <FlexBox>
                      {[
                        {
                          label: 'Share',
                          icon: icons.share2,
                          color: iconColors.primary,
                          onClick: () => {
                            const canShare =
                              'canShare' in navigator &&
                              (navigator as any).canShare();
                            if (canShare) {
                              navigator.share({ url: window.location.href });
                            } else {
                              navigator.clipboard.writeText(
                                window.location.href,
                              );
                              successToast({
                                description: 'Copied link to clipboard',
                              });
                            }
                          },
                        },
                        {
                          label: starred ? 'Starred' : 'Star',
                          icon: starred ? icons.star : icons.starOutline,
                          color: iconColors.primary,
                          onClick: () => {
                            if (starred) {
                              successToast({
                                description:
                                  "You've already starred this plugin",
                              });
                            } else if (!hubUser || !hubToken) {
                              failureToast({
                                description:
                                  'You need to be logged in to star this plugin',
                              });
                            } else {
                              setIsStarred(true);
                              starPlugin(hubUser.id, plugin.id, hubToken).catch(
                                () => {
                                  failureToast({
                                    description: 'Error starring plugin',
                                  });
                                  setIsStarred(false);
                                },
                              );
                            }
                          },
                        },
                        ...(isOwner
                          ? [
                              {
                                label: 'Update Version',
                                icon: icons.share,
                                color: iconColors.primary,
                                onClick: () =>
                                  history.push(
                                    routePaths.plugins.update(
                                      selectedWorkspace,
                                      plugin.id,
                                    ),
                                  ),
                              },
                              // Plugin deletion isn't set up in the backend yet
                              // {
                              //   label: 'Delete Package',
                              //   icon: icons.delete,
                              //   color: iconColors.red,
                              //   onClick: () => setDeletePopupOpen(true),
                              // },
                            ]
                          : [
                              {
                                label: 'Report',
                                icon: icons.info,
                                color: iconColors.red,
                                onClick: () =>
                                  history.push(
                                    `${plugin.repository_url}/issues`,
                                  ),
                              },
                            ]),
                      ].map((action) => (
                        <LinkBox
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '18px',
                          }}
                          onClick={action.onClick}
                          key={action.label}
                        >
                          <action.icon color={action.color} size="sml" />

                          <Paragraph
                            size="tiny"
                            color={action.color as any}
                            style={{ marginLeft: '8px' }}
                          >
                            {action.label}
                          </Paragraph>
                        </LinkBox>
                      ))}
                    </FlexBox>
                  </Box>
                </FlexBox>
                {/* Plugin deletion isn't set up in the backend yet */}
                {/* {isOwner && deletePopupOpen && (
                  <Popup
                    onClose={() => {
                      setDeletePopupOpen(false);
                    }}
                  >
                    <H3>Are you sure you want to delete this package?</H3>
                    <Paragraph>This cannot be undone.</Paragraph>

                    <Box marginTop="md">
                      <PrimaryButton
                        onClick={() => {
                          if (!hubToken) {
                            failureToast({
                              description:
                                'You need to be logged in to delete this plugin',
                            });
                          } else {
                            deletePlugin(pluginId, hubToken)
                              .then(() => {
                                successToast({ description: 'Deleted plugin' });
                                history.push(
                                  routePaths.plugins.list(selectedWorkspace),
                                );
                              })
                              .catch(() => {
                                failureToast({
                                  description: 'Error deleting plugin',
                                });
                              });
                          }
                        }}
                        style={{ backgroundColor: 'var(--red)' }}
                      >
                        Delete Package
                      </PrimaryButton>
                    </Box>
                  </Popup>
                )} */}
                <Tabs
                  pages={[
                    {
                      text: 'Overview',
                      Component: () => {
                        const [md, setMd] = useState('');

                        useEffect(() => {
                          // Impossible state but TypeScript doesn't realise
                          if (!plugin.readme_url) return;

                          axios
                            .get(plugin.readme_url)
                            .then((res) => setMd(res.data));
                        }, []);

                        return (
                          <Box paddingVertical="md">
                            {!plugin.readme_url ? (
                              <Paragraph>
                                {
                                  "This plugin doesn't have a Readme description."
                                }
                              </Paragraph>
                            ) : md ? (
                              <DisplayMarkdown markdown={md} />
                            ) : (
                              <Paragraph>Loading Readme...</Paragraph>
                            )}
                          </Box>
                        );
                      },
                      path: routePaths.plugins.detail.overview(
                        selectedWorkspace,
                        pluginId,
                      ),
                    },
                    {
                      text: 'Changelogs',
                      Component: () =>
                        !versions ? (
                          <Box paddingVertical="md">
                            <Paragraph>
                              {loadingVersions
                                ? 'Loading version changelogs...'
                                : "This plugin doesn't have any version changelogs to display."}
                            </Paragraph>
                          </Box>
                        ) : (
                          <Box>
                            {versions.map((v) => (
                              <FlexBox key={v.version} marginVertical="md">
                                {/* version */}
                                <Box style={{ width: '125px' }}>
                                  <Paragraph
                                    color="darkGrey"
                                    style={{
                                      fontSize: '32px',
                                      lineHeight: '1em',
                                    }}
                                  >
                                    {v.version}
                                  </Paragraph>
                                </Box>

                                {/* details */}
                                <FlexBox fullWidth>
                                  <Paragraph size="tiny" color="grey">
                                    {v.release_notes ??
                                      'No release notes for this version'}
                                  </Paragraph>
                                </FlexBox>

                                {/* yanked */}
                                <FlexBox style={{ width: '100px' }}>
                                  {v.status === 'yanked' && (
                                    <Box
                                      style={{
                                        display: 'inline-block',
                                        marginBottom: 'auto',
                                        marginLeft: 'auto',
                                        backgroundColor: '#D8131333',
                                        padding: '3px 8px',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <Paragraph size="tiny" color="red">
                                        Yanked
                                      </Paragraph>
                                    </Box>
                                  )}
                                </FlexBox>
                              </FlexBox>
                            ))}
                          </Box>
                        ),
                      path: routePaths.plugins.detail.changelogs(
                        selectedWorkspace,
                        pluginId,
                      ),
                    },
                    {
                      text: 'Requirements',
                      Component: () => (
                        <DisplayCode code={plugin.requirements.join('\n')} />
                      ),
                      path: routePaths.plugins.detail.requirements(
                        selectedWorkspace,
                        pluginId,
                      ),
                    },
                    {
                      text: 'Installing',
                      Component: () => (
                        <Box>
                          <DisplayCode code={installCommand} />
                          <DisplayCode
                            code={`from zenml.hub.${plugin.user.username}.${plugin.name} import *`}
                          />
                        </Box>
                      ),
                      path: routePaths.plugins.detail.installing(
                        selectedWorkspace,
                        pluginId,
                      ),
                    },
                    {
                      text: 'Community',
                      externalPath: `${plugin.repository_url}/issues`,
                      // placeholders to type-check
                      path: '',
                      Component: () => null,
                    },
                  ]}
                  basePath={routePaths.plugins.detail.base(
                    selectedWorkspace,
                    pluginId,
                  )}
                />
              </FlexBox>

              {/* right column */}
              <Box>
                {/* usage # & chart, ZenML favourite badge */}
                <FlexBox>
                  {/* <Box>
                    <img src={ZenMLFavourite} alt="ZenML favourite" />
                  </Box> */}
                  {/* <Box padding="md"> */}
                  {/* <Paragraph size="small">
                      Pulls:{' '}
                      {data.pullsLastWeek.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </Paragraph>
                    <Paragraph style={{ color: '#677285' }} size="tiny">
                      Last week
                    </Paragraph> */}

                  {/* line chart */}
                  {/* <Box marginVertical="md">
                      <LineChart data={data.pullsHistory} />
                    </Box> */}
                  {/* </Box> */}
                </FlexBox>

                {/* install command */}
                {/* note need to hard-code the width to match the SVG for the header */}
                <Box
                  marginTop="sm"
                  marginBottom="xl"
                  style={{ width: '294px' }}
                >
                  <img src={InstallDesignHeader} alt="Install package" />

                  <Box
                    style={{
                      padding: '0px 3px 3px 3px',
                      background:
                        'linear-gradient(90deg, #B58EB1 0%, #443D99 100%)',
                      borderRadius: '7px',
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                  >
                    <FlexBox
                      style={{
                        padding: '20px 22px 20px 10px',
                        backgroundColor: '#250E32',
                        borderRadius: '7px',
                        position: 'relative',
                      }}
                    >
                      <Paragraph
                        size="tiny"
                        color="white"
                        style={{ maxWidth: '100%' }}
                      >
                        {installCommand}
                      </Paragraph>

                      <LinkBox
                        onClick={() => {
                          navigator.clipboard.writeText(installCommand);
                          successToast({ description: 'Copied to clipboard.' });
                        }}
                      >
                        <Box
                          style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            padding: '8px',
                          }}
                        >
                          <icons.copy color={iconColors.white} size="xs" />
                        </Box>
                      </LinkBox>
                    </FlexBox>
                  </Box>
                </Box>

                {/* metrics */}
                {/* <FlexBox justifyContent="space-between" marginVertical="md">
                <Box marginRight="sm2">
                  <Paragraph className={styles.pluginMetric}>
                    {data.upvotes}
                  </Paragraph>
                  <Paragraph className={styles.pluginMetricText}>
                    Upvotes
                  </Paragraph>
                </Box>
                <Box marginRight="sm2">
                  <Paragraph className={styles.pluginMetric}>
                    {data.downloads}
                  </Paragraph>
                  <Paragraph className={styles.pluginMetricText}>
                    Downloads
                  </Paragraph>
                </Box>
                <Box>
                  <Paragraph className={styles.pluginMetric}>
                    {data.popularity}
                  </Paragraph>
                  <Paragraph className={styles.pluginMetricText}>
                    Popularity
                  </Paragraph>
                </Box>
              </FlexBox>

              <SeparatorLight /> */}

                {/* publisher */}
                <Box marginVertical="md">
                  <Paragraph size="tiny" color="grey">
                    Publisher
                  </Paragraph>
                  <Box marginTop="sm">
                    <Paragraph size="tiny" color="primary">
                      <a
                        href={
                          routePaths.plugins.list(selectedWorkspace) +
                          `?author=${plugin.user.username}`
                        }
                        style={{ color: 'inherit' }}
                      >
                        {plugin.user.username}
                      </a>
                    </Paragraph>
                  </Box>
                </Box>

                <SeparatorLight />

                {/* meta */}
                <Box marginVertical="md">
                  <Paragraph size="tiny" color="grey">
                    Meta
                  </Paragraph>
                  <Box marginTop="sm">
                    <Paragraph size="tiny" color="primary">
                      <a
                        href={plugin.repository_url}
                        style={{ color: 'inherit' }}
                      >
                        Repository (GitHub)
                      </a>
                    </Paragraph>
                  </Box>
                </Box>

                <SeparatorLight />

                {/* Documentation */}
                <Box marginVertical="md">
                  <Paragraph size="tiny" color="grey">
                    Documentation
                  </Paragraph>
                  <Box marginTop="sm">
                    <Paragraph size="tiny" color="primary">
                      <a
                        href={plugin.repository_url}
                        style={{ color: 'inherit' }}
                      >
                        API reference
                      </a>
                    </Paragraph>
                  </Box>
                </Box>

                <SeparatorLight />

                {/* More from this author */}
                <Box marginVertical="md">
                  <Paragraph size="tiny" color="grey">
                    More from this author
                  </Paragraph>
                  <Box marginTop="sm">
                    <Paragraph size="tiny" color="primary">
                      <a
                        href={
                          routePaths.plugins.list(selectedWorkspace) +
                          `?author=${plugin.user.username}`
                        }
                        style={{ color: 'inherit' }}
                      >
                        See all
                      </a>
                    </Paragraph>
                  </Box>
                </Box>
              </Box>
            </FlexBox>
          </PluginsLayout>
        )
      )}
    </AuthenticatedLayout>
  );
};

export default PluginDetail;