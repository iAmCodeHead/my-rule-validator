import { Req } from "../types/request.types";
import { Resp } from "../types/response.types";
import { condition } from "../types/condition.types";
import { IRule } from "../interfaces/rule.interface";


const conditionSet: Array<condition> = ["eq", "neq", "gt", "gte", "contains"];
  
type Condition = typeof conditionSet[number];

const isDataDefined = (data: any) => {
    return data !== null && data !== undefined;
  };

const isDataString = (x: any) => {
    return Object.prototype.toString.call(x) === '[object String]';
  }
  
const isDataObject = (x : any, strict = true) => {
    const checkIfArray = Object.prototype.toString.call(x) === "[object Array]";
    let dataType: any;
  
    if (x === null || x === undefined || !!checkIfArray) {
      return false;
    }
  
    const instanceOfObject = x instanceof Object;
    const typeOfObject = typeof x === 'object';
    const constructorUndefined = x.constructor === undefined;
    const constructorObject = x.constructor === Object;
    const typeOfConstructorObject = typeof x.constructor === 'function';

    if (strict === true) {
        dataType = (instanceOfObject || typeOfObject) && (constructorUndefined || constructorObject);
    } else {
        dataType = (constructorUndefined || typeOfConstructorObject);
    }
    return dataType;
  };

  
const isFieldDefinedAndOfTypeString = (field, name) => {
  
    if (!isDataDefined(field)) {
      return { isSuccess: false, errorMessage: `${name} is required.` };
    }
    if (!isDataString(field)) {
      return { isSuccess: false, errorMessage: `${name} should be a string.` };
    }
    return { isSuccess: true }
  }
  

const inspectRule = (ruleObject: IRule): { rule?: IRule; isSuccess: boolean; errorMessage?: string } => {
  
    if (!isDataDefined(ruleObject)) {
      return { isSuccess: false, errorMessage: "rule is required." };
    }
  
    if (!isDataObject(ruleObject)) {
      return { isSuccess: false, errorMessage: "rule should be an object." };
    }
  
    const arr = [[ruleObject.field, 'field'], [ruleObject.condition, 'condition']];
  
    for (let args of arr) {
      const isDefinedAndIsString = isFieldDefinedAndOfTypeString(args[0], args[1]);
      if (!isDefinedAndIsString.isSuccess) return isDefinedAndIsString;
    }
  
  
    if (!isDataDefined(ruleObject.condition_value)) {
      return { isSuccess: false, errorMessage: "condition_value is required." };
    }
  
    if (!conditionSet.includes(ruleObject.condition)) {
      return { isSuccess: false, errorMessage: `condition is required.`};
    }
  
    return { rule: ruleObject as IRule, isSuccess: true };
  }


  export const validateInput = (value) => {
    let { message, status, data } = preValidator(value);
  
    const { rule } = value;
    let validatedInput = {
      message,
      status,
      data
    }
  
    if (data != null && message.includes("failed")) {
        validatedInput = {
        message,
        status,
        data: {
          validation: {
            error: false,
            field: rule.field,
            field_value: responseFormat(rule, data),
            condition: rule.condition,
            condition_value: rule.condition_value
          }
        }
      }
  
      return validatedInput;
    }
    if (data != null && message.includes("successfully")) {
        validatedInput = {
        message,
        status,
        data: {
          validation: {
            error: false,
            field: rule.field,
            field_value: responseFormat(rule, data),
            condition: rule.condition,
            condition_value: rule.condition_value
          }
        }
      }
      return validatedInput;
    }
    return validatedInput;
  }
  
  export const preValidator = (value: any): Resp => {
  
    if (!value.data && !value.rule) {
      return { message: "Invalid JSON payload passed.", status: "error", data: null };
    }
    
    if(value.rule && isNaN(parseInt(value.rule.condition_value, 10))) {
        return { message: "condition_value should be a|an integer.", status: "error", data: null };
    }

    if(value.data && isNaN(parseInt(value.data.age, 10))) {
        return { message: "age should be a|an integer.", status: "error", data: null };
    }
    

    const { data, rule }: Req = value;
  
    const ruleOrError = inspectRule(rule);
  
    if (!ruleOrError.isSuccess) {
      return { message: ruleOrError.errorMessage, status: "error", data: null };
    }
  
    if (!isDataDefined(data)) {
      return { message: "data is required.", status: "error", data: null };
    }
  
    const { value: fieldValue, isSuccess: lessThan2 } = getDataSet(
      data,
      rule.field
    );
  
    if(isNaN(fieldValue)){
        return { message: `${rule.field} should be a|an integer.`, status: "error", data: null };
    }
    
    if (!fieldValue || !lessThan2) {
      return {
        message: `field ${rule.field} is missing from data.`,
        status: "error",
        data: null
      };
    }

    const checkCondition = (fieldValue: string, condition_value: any, condition: Condition) => {
        switch (condition.toLowerCase()) {
          case "eq":
            return fieldValue === condition_value;
          case "neq":
            return fieldValue !== condition_value;
          case "gt":
            return fieldValue > condition_value;
          case "gte":
            return fieldValue >= condition_value;
          case "contains":
            return fieldValue.includes(condition_value);
          default:
            return false;
        }
      }
  
    const isConditionMet = checkCondition(fieldValue, rule.condition_value, rule.condition);
  
    if (isConditionMet) {
      return {
        message: `field ${rule.field} successfully validated.`,
        status: "success",
        data: value.data
      };
    } else {
      return {
        message: `field ${rule.field} failed validation.`,
        status: "error",
        data: value.data
      };
    }
  
  }

  const getDataSet = (data: any, path: string): { value?: any; isSuccess: boolean } => {
    const keys = path.split("."); 
  
    if (keys.length > 2 || !keys[0]) {
      return { isSuccess: false };
    } else if (keys.length === 2) {
      return { value: data[keys[0]][keys[1]], isSuccess: true };
    }
  
    return { value: data[keys[0]], isSuccess: true }; 
  }
  
  
  
  export const responseFormat = (rule, data) => {
    let check = rule.field.split('.');
    if (check.length === 1) {
        return data[check[0]]
    } else if (check.length === 2) {
      return data[check[0]][check[1]]
    } else {
        return;
    }
  }
