import { createPersistStore } from "../utils/store";
import { StoreKey } from "../constant";

export interface LogsData {
  content: string;
}

export const createEmptyLogs = (): LogsData => ({
  content: ""
});

export const DEFAULT_LOGS_STATE = {
  logs: createEmptyLogs(),
}
export type LogsState = typeof DEFAULT_LOGS_STATE;

export const useLogsStore = createPersistStore(
  { ...DEFAULT_LOGS_STATE },
  (set, get) => {
    const methods = {
      setLogs(content?: string) {
        set({
          logs: {
            content: content ?? "",
          }
        })
      },
      getLogs() {
        return get().logs.content;
      }
    };
    return methods;
  },
  {
    name: StoreKey.Logs,
    version: 1.1,
    migrate(state, version) {
      const newState = JSON.parse(JSON.stringify(state)) as LogsState;
      return newState as any;
    }
  }
)
