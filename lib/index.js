import slackService from "../lib/slack_service.js";
import prompt from 'prompt';

const promptForInput = (schema) => {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(schema, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


const lib = {
  channels: async () => {
    let channels = (await slackService.getChannels()).map(({id, name}) => {
      return {id, name};
    });
    console.log(channels);
  },

  messages: async () => {
    const schema = {
      properties: {
        channel: {
          description: "Enter channel ID",
          message: "Enter channel ID",
          required: true
        }
      }
    };
    const config = await promptForInput(schema);

    let messages = (await slackService.getConversation(config)).map(({text, ts, reply_count}) => {
      return {
        text, ts,
        reply_count: reply_count || 0
      };
    });

    console.log(messages);
  },

  replies: async () => {
    const schema = {
      properties: {
        channel: {
          description: "Enter channel ID",
          message: "Enter channel ID",
          required: true
        },
        ts: {
          description: "Enter message ID (ts)",
          message: "Enter message ID (ts)",
          required: true
        }
      }
    };
    const config = await promptForInput(schema);

    let messages = (await slackService.getReplies(config)).map(({text}) => {
      return {text};
    });

    console.log(messages);
  }
};

lib[process.argv[2]]();


