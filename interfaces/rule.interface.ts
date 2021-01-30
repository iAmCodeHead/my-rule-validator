import { condition } from '../types/condition.types';

export interface IRule {
    field: string
    condition: condition,
    condition_value: any;
}