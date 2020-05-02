import slackApi from "./slack_api.js";


const getAllPaginated = async (url, key, query) => {
  const response = await slackApi.request(url, query);
  let cursor = response.response_metadata ? response.response_metadata.next_cursor : "";
  let channelsOrGroups = [...response[key]];

  while(cursor !== "") {
    let res = await slackApi.request(url, {...query, cursor});
    channelsOrGroups = [...channelsOrGroups, ...res[key]];
    cursor = res.response_metadata.next_cursor;
  }
  return channelsOrGroups;
};


export default {
  getChannels: async () => {
    const channels = await getAllPaginated("https://slack.com/api/conversations.list", "channels");
    const groups = await getAllPaginated("https://slack.com/api/groups.list", "groups");
    return [...channels, ...groups];
  },

  getConversation: async (query) => {
    return await getAllPaginated("https://slack.com/api/conversations.history", "messages", query);
  },

  getReplies: async (query) => {
    return await getAllPaginated("https://slack.com/api/conversations.replies", "messages", query);
  }
}
