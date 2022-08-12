import { Event } from './event.model';
import { Medication } from './medication.model';
import { Period } from './period.model';
import { Seizure } from './seizure.model';

export declare type TrackingCore = Medication | Seizure | Event | Period;
