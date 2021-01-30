export type Resp = {
    message: string;
    status: string;
    data?: {
      validation: {
        error: boolean,
        field: string,
        field_value: string,
        condition: string,
        condition_value: string
      }
    }
  };