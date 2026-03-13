declare module "bullmq" {
  export class Queue {
    constructor(name: string, opts?: any);
    add(...args: any[]): Promise<any>;
  }

  export class Worker {
    constructor(name: string, processor: any, opts?: any);
    on(...args: any[]): any;
    close(...args: any[]): Promise<any>;
  }

  export class QueueEvents {
    constructor(name: string, opts?: any);
    on(...args: any[]): any;
    close(...args: any[]): Promise<any>;
  }

  export class QueueScheduler {
    constructor(name: string, opts?: any);
    close(...args: any[]): Promise<any>;
  }

  export type JobsOptions = any;
}
