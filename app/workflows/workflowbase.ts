import { ClientApi, LLMConfig, MessageRole } from "../client/api";
import { requestDownloadJobFile, requestDownloadTaskResultFile, requestJobFiles, requestJobId, requestJobTasksStatus, requestLogs, requestRemoveJobFile, requestTaskResults, requestUploadFile } from "../components/data-provider/dataaccessor";
import { ModelProvider } from "../constant";
import { ChatMessage, ChatSession, useAccessStore } from "../store";

export enum WorkflowItemTypeEnum {
  WorkflowItem = "WorkflowItem",
  scGNNWorkflowItem = "scGNNWorkItem",
  scGNNWorkflowExampleItem = "scGNNWorkflowExampleItem",
}

export interface WorkflowItem {
  sessionId?: string;
  type: WorkflowItemTypeEnum;
  data: Record<string, any>;  // save workflow data, like step
}

interface ChatStoreMethods {
  addNewMessage: (msg: string, role?: MessageRole, streaming?: boolean) => void;
}

class WorkflowItemHandler {
  methods: ChatStoreMethods;
  constructor(methods: ChatStoreMethods) {
    this.methods = methods;
  }

  onFileUploaded(wfi: WorkflowItem, message: string): void {}
  onUserMessage(
    wfi: WorkflowItem,
    message: ChatMessage,
  ): {
    result: boolean;
    flowMessage?:
      | [{ role: string; content: string }]
      | { role: string; content: string };
  } {
    return { result: false };
  }
}

class scGNNWorkflowItemHandler extends WorkflowItemHandler {
  constructor(methods: ChatStoreMethods) {
    super(methods);
  }
  onFileUploaded(wfi: WorkflowItem, message: string): void {
    if (wfi.data.step === undefined) {
      wfi.data.step = 0;
    }
    this.methods.addNewMessage(
      message+"\n\nYou've uploaded data files, Now, tell me what do you want to do?",
    );
    wfi.data.step++
  }
  onUserMessage(
    wfi: WorkflowItem,
    message: ChatMessage,
  ): {
    result: boolean;
    flowMessage?:
      | [{ role: string; content: string }]
      | { role: string; content: string }
      | undefined;
  } {
    const step = wfi.data.step;
    if (step === undefined) {
      return { result: false };
    }
    return { result: false };
  }
}

class scGNNWorkflowExampleItemHandler extends WorkflowItemHandler {
  constructor(methods: ChatStoreMethods) {
    super(methods);
  }
  onFileUploaded(wfi: WorkflowItem, message: string): void {
    if (wfi.data.step === undefined) {
      wfi.data.step = 0;
    }
    this.methods.addNewMessage(
      "\n\nYou've uploaded data files successfully, you can now view, delete or download the uploaded file in file manager."
    );
    setTimeout(() => {
      this.methods.addNewMessage(
        "You can tell us what you would like to do, such as \"Please run scGNN on the uploaded data file\""
      )
    }, 2000);
    wfi.data.step = scGNNExampleWorkflowStepEnum.DataFileUploaded;
  }
  onUserMessage(wfi: WorkflowItem, message: ChatMessage): { result: boolean; flowMessage?: [{ role: string; content: string; }] | { role: string; content: string; } | undefined; } {
    return {result: false};
  }
}

enum scGNNWorkflowStepEnum {
  InitialStep = 0,
}
enum scGNNExampleWorkflowStepEnum {
  InitialStep = 0,
  DataFileUploaded = 1,
}

export class WorkflowManager {
  handlers: Record<string, WorkflowItemHandler>;
  _methods: ChatStoreMethods;
  constructor(methods: ChatStoreMethods) {
    this._methods = methods;
    this.handlers = {};
    this.handlers[WorkflowItemTypeEnum.WorkflowItem] = new WorkflowItemHandler(this.methods);
    this.handlers[WorkflowItemTypeEnum.scGNNWorkflowItem] = new scGNNWorkflowItemHandler(this.methods);
    this.handlers[WorkflowItemTypeEnum.scGNNWorkflowExampleItem] = new scGNNWorkflowExampleItemHandler(this.methods);
  }

  set methods(methods: ChatStoreMethods) {
    this._methods = methods;
    Object.keys(this.handlers).forEach(k => (this.handlers[k].methods=this._methods))
  }
  get methods(){
    return this._methods;
  }
   
  createWorkflow(workflowType?: WorkflowItemTypeEnum): WorkflowItem {
    workflowType = workflowType ?? WorkflowItemTypeEnum.WorkflowItem;
    if (workflowType === WorkflowItemTypeEnum.WorkflowItem) {
      return {
        type: WorkflowItemTypeEnum.WorkflowItem,
        data: {},
      }
    } else if (workflowType === WorkflowItemTypeEnum.scGNNWorkflowItem) {
      return {
        type: WorkflowItemTypeEnum.scGNNWorkflowItem,
        data: {},
      }
    } else {
      return {
        type: WorkflowItemTypeEnum.scGNNWorkflowExampleItem,
        data: {},
      }
    }
  }

  onFileUploaded(wfi: WorkflowItem, message: string): void {
    if (!this.handlers[wfi.type]) {
      return;
    }
    this.handlers[wfi.type].onFileUploaded(wfi, message);
  }
  onUserMessage(wfi: WorkflowItem, message: ChatMessage) {
    if (!this.handlers[wfi.type]) {
      return {result: false};
    }
    return this.handlers[wfi.type].onUserMessage(wfi, message);
  }
  async chat(
    messages: ChatMessage[],
    config: LLMConfig,
    onUpdate: (message: string) => void,
    onFinish: (message: string, taskId?: string) => void,
    onError: (error: Error) => void,
    onController: (controller: AbortController) => void,
  ) {
    let api: ClientApi = new ClientApi(ModelProvider.GPT);
    await api.llm.chat({
      messages,
      config,
      onUpdate,
      onFinish,
      onError,
      onController,
    })
  }
  async requestJobId(session: ChatSession) {
    const accessStore = useAccessStore.getState();
    return await requestJobId(accessStore.subPath);
  }
  async requestUploadFile(session: ChatSession, file: File, dataType: string) {
    const accessStore = useAccessStore.getState();
    return await requestUploadFile(session.jobId??"", file, dataType, accessStore.subPath);
  }
  async requestLogs(session: ChatSession, taskId: string) {
    const accessStore = useAccessStore.getState();
    return await requestLogs(taskId, accessStore.subPath);
  }
  async requestJobFiles(session: ChatSession) {
    const accessStore = useAccessStore.getState();
    return await requestJobFiles(session.jobId??"", accessStore.subPath);
  }
  async requestDownloadJobFile(session: ChatSession, filename: string) {
    const accessStore = useAccessStore.getState();
    return await requestDownloadJobFile(session.jobId??"", filename, accessStore.subPath);
  }
  async requestDownloadTaskResultFile(session: ChatSession, taskId: string, filename: string) {
    const accessStore = useAccessStore.getState();
    return await requestDownloadTaskResultFile(taskId, filename, accessStore.subPath);
  }
  async requestRemoveJobFile(session: ChatSession, filename: string) {
    const accessStore = useAccessStore.getState();
    return await requestRemoveJobFile(session.jobId??"", filename, accessStore.subPath);
  }
  async requestTaskResults(session: ChatSession, taskId: string) {
    const accessStore = useAccessStore.getState();
    return await requestTaskResults(taskId, accessStore.subPath);
  }
  async requestJobTasksStatus(session: ChatSession) {
    const accessStore = useAccessStore.getState();
    return await requestJobTasksStatus(session.jobId??"", accessStore.subPath);
  }
}
