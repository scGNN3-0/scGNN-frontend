import { ChatMessage, ChatSession } from "../store";

export enum WorkflowItemTypeEnum {
  WorkflowItem = "WorkflowItem",
  scGNNWorkflowItem = "scGNNWorkItem",
}

export interface WorkflowItem {
  sessionId?: string;
  type: WorkflowItemTypeEnum;
  data: Record<string, any>;
}

interface ChatStoreMethods {
  addNewMessage: (msg: string) => void;
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
      "You've uploaded data files, Now, tell me what do you want to do?",
    );
    wfi.data.step++;
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

enum scGNNWorkflowStepEnum {
  InitialStep = 0,
}

export class WorkflowManager {
  handlers: Record<string, WorkflowItemHandler>;
  _methods: ChatStoreMethods;
  constructor(methods: ChatStoreMethods) {
    this._methods = methods;
    this.handlers = {};
    this.handlers[WorkflowItemTypeEnum.WorkflowItem] = new WorkflowItemHandler(this.methods);
    this.handlers[WorkflowItemTypeEnum.scGNNWorkflowItem] = new scGNNWorkflowItemHandler(this.methods);
  }

  set methods(methods: ChatStoreMethods) {
    this._methods = methods;
    Object.keys(this.handlers).forEach(k => (this.handlers[k].methods=this._methods))
  }
  get methods(){
    return this._methods;
  }
   
  createWorkflow(session?: ChatSession, methods?: any): WorkflowItem {
    if (!session) {
      return {
        type: WorkflowItemTypeEnum.WorkflowItem,
        data: {},
      }
    }
    return {
      type: WorkflowItemTypeEnum.scGNNWorkflowItem,
      data: {},
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
  
}
