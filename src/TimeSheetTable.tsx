import React, { useState } from 'react';
import { TimeSheetRecord, StorageKeys, TimeSheet, UpdateActionPayload } from './types';
import { TimeLogRow } from "./TimeSheetRow";
import { setItem } from './appStorageManager';
import { TypeOfTag } from 'typescript';

export interface TimeSheetTableProps {
  timeSheet: TimeSheet;
  setSignal: (e: any) => void;
  sort: (sortSetting: SortSetting) => void;
}

export enum Field {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  SIGN_IN = 'signInHour',
  SIGN_OUT = 'signOutHour',
}

export enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortSetting {
  field: Field | string,
  order: ORDER,
  type: TypeOfTag
}

export function TimeSheetTable(props: TimeSheetTableProps) {
  const [sortSettings, setSortSettings] = useState<SortSetting[]>([
    { field: Field.FIRST_NAME, order: ORDER.ASC, type: 'string' },
    { field: Field.LAST_NAME, order: ORDER.ASC, type: 'string' },
    { field: Field.SIGN_IN, order: ORDER.ASC, type: 'number' },
    { field: Field.SIGN_OUT, order: ORDER.ASC, type: 'number' },
  ]);

  const setPayload = (e: any, payload: UpdateActionPayload) => {
    setItem(StorageKeys.ACTION_PAYLOAD, payload);
    props.setSignal(e);
  }

  const sort = (sortByField: string) => {
    const updatedSettings = sortSettings.map(setting => {
      if (sortByField !== setting?.field) {
        return setting;
      }

      if (setting.order === ORDER.ASC) {
        setting.order = ORDER.DESC;
        return setting;
      }

      setting.order = ORDER.ASC;
      return setting;
    });

    setSortSettings(updatedSettings);
    const setting = sortSettings.find(s => s.field === sortByField);
    props.sort(setting as SortSetting);
  }

  const getSortIcon = (sortByField: string) => {
    const setting = sortSettings.find(s => s.field === sortByField);
    return setting?.order === ORDER.ASC ?
      <i className="fa fa-sort-amount-asc text-primary" aria-hidden="true"></i> :
      <i className="fa fa-sort-amount-desc text-primary" aria-hidden="true"></i>
  }

  return (
    <table className="table table-hover table-sm table-light text-left d-print-none">
      <thead>
        <tr className="bg-dark text-light">
          <th scope="col">#</th>
          <th className="table_sort" onClick={() => sort(Field.FIRST_NAME)} scope="col">First Name {getSortIcon(Field.FIRST_NAME)}</th>
          <th className="table_sort" onClick={() => sort(Field.LAST_NAME)} scope="col">Last Name {getSortIcon(Field.LAST_NAME)}</th>
          <th className="table_sort" onClick={() => sort(Field.SIGN_IN)} scope="col">Time In {getSortIcon(Field.SIGN_IN)}</th>
          <th scope="col">Sign In By</th>
          <th className="table_sort" onClick={() => sort(Field.SIGN_OUT)} scope="col">Time Out {getSortIcon(Field.SIGN_OUT)}</th>
          <th scope="col">Sign Out By</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {props.timeSheet ? props.timeSheet.timeSheetRecords?.map((student: TimeSheetRecord, i: number) => (
          <TimeLogRow key={i} number={i + 1} setPayload={setPayload} row={student} />)) :
          <tr className="text-left">
            <td colSpan={7}>No time sheet has been created for today. Check that you have at least on active student.</td>
          </tr>}
      </tbody>
    </table>
  );
}
