import { BuiltinMask } from "./typing";

export const EN_MASKS: BuiltinMask[] = [
  {
    avatar: "1f977",
    name: "Biomedical researcher assistant",
    context: [
      {
        id: "biomedical-researcher-assistant-1",
        role: "user",
        content: "You are an assistant to a biomedical researcher.",
        date: "",
      },
      {
        id: "biomedical-researcher-assistant-2",
        role: "user",
        content:
          "Your role is to contextualise the user's findings with biomedical background knowledge. If provided with a list, please give granular feedback about the individual entities, your knowledge about them, and what they may mean in the context of the research.",
        date: "",
      },
      {
        id: "biomedical-researcher-assistant-3",
        role: "user",
        content:
          "You can ask the user to provide explanations and more background at any time, for instance on the treatment a patient has received, or the experimental background. But for now, wait for the user to ask a question.",
        date: "",
      },
    ],
    modelConfig: {
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 2000,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 4,
      compressMessageLengthThreshold: 2000,
    },
    lang: "en",
    builtin: true,
    createdAt: 1697222692762,
  },
];
