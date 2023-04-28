import {Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {OverlayPanel} from "primeng/overlaypanel";
import {Calendar} from "primeng/calendar";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as events from "events";
import {Observable, Subscription} from "rxjs";

const STRING_OPS = [
  {label: 'Exact match', value: {label: 'EXACT_MATCH', symbol: '=', name: 'EXACT_MATCH', include: true, iconCls: 'pi-bars'}},
  {label: 'Begins with Case Sensitive', value: {label: 'BEGINS_WITH_CASE_SENSITIVE', symbol: 'aA.', name: 'STARTS_WITH', include: true,
      iconCls: 'pi-step-forward'}},
  {label: 'Begins With', value: {label: 'BEGINS_WITH', symbol: 'A.', name: 'BEGINS_WITH', include: true,
      iconCls: 'pi-step-forward'}},
  {label: 'Ends With', value: {label: 'ENDS_WITH', symbol: '.A', name: 'ENDS_WITH', include: true,
      iconCls: 'pi-step-backward-alt'}},
  {label: 'Contains', value: {label: 'CONTAINS', symbol: '.A.', name: 'CONTAINS', include: true,
      iconCls: 'pi-info-circle'}},
  {label: 'Not Equal To', value: {label: 'NOT_EQUAL_TO', symbol: '!=', name: 'NOT_EQUAL', include: true,
      iconCls: 'pi-code'}}
];

const DATE_OPS = [
  {label: 'On', value: {label: 'ON', symbol: '=', name: 'EQUAL', include: true, iconCls: 'pi-bars'}},
  {label: 'Before', value: {label: 'BEFORE', symbol: '<', name: 'LESS', include: true, iconCls: 'pi-angle-left'}},
  {label: 'On or Before', value: {label: 'ON_OR_BEFORE', symbol: '<=', name: 'LESS_OR_EQUAL', include: true,
      iconCls: 'pi-angle-double-left'}},
  {label: 'After', value: {label: 'AFTER', symbol: '>', name: 'GREATER', include: true, iconCls: 'pi-angle-right'}},
  {label: 'On or After', value: {label: 'ON_OR_AFTER', symbol: '>=', name: 'GREATER_OR_EQUAL', include: true,
      iconCls: 'pi-angle-double-right'}},
  {label: 'Between', value: {label: 'BETWEEN', symbol: '<>', name: 'BETWEEN', include: true, iconCls: 'pi-code'}},
  {label: 'Not On', value: {label: 'NOT_ON', symbol: '!=', name: 'NOT_EQUAL', include: true, iconCls: 'pi-exclamation-circle'}}];

const NUMBER_OPS = [
  {label: 'Equals To', value: {label: 'EQUALS_TO', symbol: '=', name: 'EQUAL', include: true, iconCls: 'pi-bars'}},
  {label: 'Less Than', value: {label: 'LESS_THAN', symbol: '<', name: 'LESS', include: true, iconCls: 'pi-angle-left'}},
  {label: 'Less Than or Equal To', value: {label: 'LESS_THAN_OR_EQUAL_TO', symbol: '<=', name: 'LESS_OR_EQUAL',
      include: true, iconCls: 'pi-angle-double-left'}},
  {label: 'Greater Than', value: {label: 'GREATER_THAN', symbol: '>', name: 'GREATER', include: true, iconCls: 'pi-angle-right'}},
  {label: 'Greater Than or Equal To', value: {label: 'GREATER_THAN_OR_EQUAL_TO', symbol: '>=', name: 'GREATER_OR_EQUAL', include: true,
      iconCls: 'pi-angle-double-right'}},
  {label: 'Between', value: {label: 'BETWEEN', symbol: '<>', name: 'BETWEEN', include: true, iconCls: 'pi-code'}},
  {label: 'Not Equal To', value: {label: 'NOT_EQUAL_TO', symbol: '!=', name: 'NOT_EQUAL', include: true, iconCls: 'pi-exclamation-circle'}}];

const DATE_ENCRYPT_OPS = [
  {label: 'On', value: {label: 'ON', symbol: '=', name: 'EQUAL', include: true, iconCls: 'pi-bars'}},
  {label: 'Not On', value: {label: 'NOT_ON', symbol: '!=', include: true, iconCls: 'icon-Not-Equal'}}];

const NUMBER_ENCRYPT_OPS = [
  {label: 'Equals To', value: {label: 'EQUALS_TO', symbol: '=', name: 'EQUAL', include: true, iconCls: 'pi-bars'}},
  {label: 'Not Equal To', value: {label: 'NOT_EQUAL_TO', symbol: '!=', name: 'NOT_EQUAL', include: true, iconCls: 'pi-exclamation-circle'}}];

const ENCRYPTED_OPS = [
  {label: 'Exact match', value: {label: 'EXACT_MATCH', symbol: '=', name: 'EXACT_MATCH', include: true, iconCls: 'pi-bars'}},
  {label: 'Does Not Match', value: {label: 'DOES_NOT_MATCH', symbol: '!=', name: 'DOES_NOT_MATCH', include: true,
      iconCls: 'pi-exclamation-circle'}}];

interface Operator {
  value: string;
  label: string;
  name: string;
  include: boolean;
  iconCls: string;
  symbol: string;
}

interface IAEnum {
  label: string;
  value: string;
}

interface dataColumn {
  label: string;
  dataType: string;
}

declare const _: unknown;

@Component({
  selector: 'app-popup-filter',
  templateUrl: './popup-filter.component.html',
  styleUrls: ['./popup-filter.component.scss']
})

export class PopupFilterComponent implements OnInit, OnDestroy {
  @ViewChild('popContent', {static: true})
  filterPopup!: OverlayPanel;
  @ViewChild('opDropDown') opDropDown: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('inputField1') inputEl: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('input2') inputEl2: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('calendar') calendar: Calendar | undefined;
  @ViewChild('target', { static: true }) header: ElementRef<HTMLInputElement> = {} as ElementRef;  // button

  @Input() colIndex = 0;
  @Input()
  column!: dataColumn;
  @Input() filterType = '';
  @Input() allowedOperators = [];
  @Input() enumItems: IAEnum[] = [];
  @Input() disabled = false;
  @Input() disableMessage = null;
  @Input() displayOnly = false;
  private eventsSubscription: Subscription;
  @Input() events: Observable<any> = new Observable<any>();

  @Output() filterExpressionChanged = new EventEmitter();

  private _emitChangeOnInit = true;
  @Input() set emitChangeOnInit(value: boolean) {
    this._emitChangeOnInit = value;
  }

  @Input() selectedOperator: Operator = {
    value: '',
    label: '',
    name: '',
    include: false,
    iconCls: '',
    symbol: ''
  };
  filterOperators: Operator[] = [];
  templateType = 'STRING';
  inputValue: unknown;
  inputValue2: unknown;
  displayValue = '';
  displayValue2 = '';
  toolTip = '';
  popupHidden = true;

  timeValue1: unknown;
  timeValue2: unknown;
  milliseconds1 = 0;
  milliseconds2 = 0;
  inputFormat: any;

  constructor() {
    this.eventsSubscription = Subscription.EMPTY;
  }
  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(({data}) => {
      this.filterType = data.column.dataType;
    switch (this.filterType.toUpperCase()) {
      case 'STRING':
        this.filterOperators = Object.assign(STRING_OPS);
        this.templateType = 'STRING';
        this.inputValue = undefined;
        this.inputValue2 = undefined;
        break;
      case 'DATETIME':
      case 'DATE':
        this.filterOperators = Object.assign(DATE_OPS);
        this.templateType = 'DATE';
        this.inputValue = undefined;
        this.inputValue2 = undefined;
        break;
      case 'NUMBER':
        this.filterOperators = Object.assign(NUMBER_OPS);
        this.templateType = 'NUMBER';
        this.inputValue = '';
        this.inputValue2 = '';
        break;
      case 'ENUM':
        this.filterOperators = Object.assign(ENCRYPTED_OPS);
        this.templateType = 'ENUM';
        this.inputValue = '';
        this.inputValue2 = '';
        break;
      case 'STRING_ENCRYPTED':
        this.filterOperators = Object.assign(ENCRYPTED_OPS);
        this.templateType = 'STRING';
        this.inputValue = '';
        this.inputValue2 = '';
        break;
      case 'DATE_ENCRYPTED':
        this.filterOperators = Object.assign(DATE_ENCRYPT_OPS);
        this.templateType = 'DATE';
        this.inputValue = null;
        this.inputValue2 = null;
        break;
      case 'NUMBER_ENCRYPTED':
        this.filterOperators = Object.assign(NUMBER_ENCRYPT_OPS);
        this.templateType = 'NUMBER';
        this.inputValue = 0;
        this.inputValue2 = 0;
        break;
      default:
        this.filterOperators = Object.assign(STRING_OPS);
        this.inputValue = '';
        this.inputValue2 = '';
        this.templateType = 'STRING';
    }

    if (this.allowedOperators && this.allowedOperators.length > 0) {
      // this.filerOutExcludedOperations();
      // if (this.column.defaultOp) {
      //   const index = _.findIndex(this.filterOperators, op => {
      //     return op.value.name === this.column.defaultOp;
      //   });
      //   if (index > -1) {
      //     const tmp = this.filterOperators[index];
      //     this.filterOperators.splice(index, 1);
      //     this.filterOperators.unshift(tmp);
      //   }
      // }
    }
    this.inputFormat = { placeHolder: 'm/d/yyyy', format: 'm/d/yy', hourFormat: '12' }; // this.datetimeService.getInputFormat();
    // this.selectedOperator = this.filterOperators[0];
    // // When values for op and inputValue are set from outside ,set them and run filter so displayValues are produced
    // if (this.column && this.column.filterValue && this.column.filterValue.length > 0 &&
    //   this.column.filterOp && this.column.filterOp.length > 0) {
    //   this.inputValue = this.parseValue(this.column, this.column.filterValue);
    //   this.inputValue2 = this.parseValue(this.column, this.column.filterValue2);
    //   const op = this.findOperatorBySymbol(this.column.filterOp);
    //   if (op !== null) {
    //     this.selectedOperator = op;
    //   }
    //   this.applyFilter(null, this._emitChangeOnInit);
    // }
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  togglePopup(event: Event, target: any) {
    if (this.popupHidden) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-filterPopupignore
      this.filterPopup.show(event, target);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.filterPopup.hide();
    }
  }

  parseValue(col: { dataType?: any; }, value: string | number | Date) {
    if (value && (col.dataType === 'DATETIME' || col.dataType === 'DATE')) {
      return new Date(value);
    }
    return value;
  }

  returnFocusToTop() {
    setTimeout(() => {
      const trigger = document.getElementById('ia-search-run-inline-filter-trigger');
      if (trigger) {
        trigger.focus();
      }
    }, 1);
  }

  private removeAriaExpandedAttributeFromHiddenInput() {
    // const elms: NodeListOf<Element> = document.querySelectorAll('div.p-hidden-accessible input');
    // elms.forEach(elm => {
    //   elm.removeAttribute('aria-expanded');
    // });
    // const dropdownOpened = document.querySelector('.p-dropdown.p-component');
    // dropdownOpened.removeAttribute('aria-activedescendant');
    // dropdownOpened.setAttribute('aria-expanded', 'false');
  }

  findOperatorBySymbol(op: string) {
    for (let i = 0; i < this.filterOperators.length; i++) {
      if ((this.filterOperators[i].value as any).symbol === op) {
        return (this.filterOperators[i].value as any);
      }
    }
    return null;
  }

  // filerOutExcludedOperations() {
  //   const tempOperators = this.filterOperators;
  //   this.filterOperators = tempOperators.filter(obj => {
  //     for (let i = 0; i < this.allowedOperators.length; i++) {
  //       // @ts-ignore
  //       if (obj.value['name'] === this.allowedOperators[i]) {
  //         return obj;
  //       }
  //     }
  //   });
  // }

  filterRangeViolation(value: string) {
    return false;
    // let fromValue = this.inputValue;
    // let toValue = this.inputValue2;
    // let isViolation = false;
    //
    // if (fromValue && toValue) {
    //   if (type === 'NUMBER') {
    //     fromValue = Number.parseInt(fromValue, 10);
    //     toValue = Number.parseInt(toValue, 10);
    //   } else if (type === 'DATE') {
    //     fromValue  = this.formatDateTimeValue(this.inputValue, this.timeValue1, this.milliseconds1);
    //     toValue  = this.formatDateTimeValue(this.inputValue2, this.timeValue2, this.milliseconds2);
    //   }
    //   if (fromValue && toValue) {
    //     isViolation = fromValue > toValue;
    //   }
    // }
    //
    // return isViolation;
  }

  isBetweenRequired() {
    let isViolation = false;
    if (!this.inputValue && !this.inputValue2) {
      isViolation = true;
    }
    return isViolation;
  }

  inputChanged(evt: events) {
    return;
  }

  formatNumber(input: any) {
    return input;
    // if (!input) {
    //   return '';
    // }
    // const numArray = input.split(';');
    // if (numArray.length > 0 ) {
    //   for (let i = 0; i < numArray.length; i++) {
    //     numArray[i] = this.numberPipe.transform(numArray[i], this.column.formatting, this.datetimeService.getCurrentLocale(),
    //       this.column.disableThousandSeparator ? 'disableThousandSeparator' : '');
    //   }
    //   return numArray.join(';');
    // }
    // return this.numberPipe.transform(input, this.column.formatting, this.datetimeService.getCurrentLocale(),
    //   this.column.disableThousandSeparator ? 'disableThousandSeparator' : '');
  }

  enumSelectionChanged(e: any) {
    this.inputValue = e;
  }

  inputTime1Changed(e: events) {
    if (!e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.inputValue?.setHours(0, 0, 0, 0);
      this.milliseconds1 = 0;
    }
  }

  inputTime2Changed(e: events) {
    if (!e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.inputValue2?.setHours(0, 0, 0, 0);
      this.milliseconds2 = 0;
    }
  }

  setToolTip() {
    const multiValues = this.selectedOperator.label === 'BETWEEN' /* && this.displayValue2 !== ''  */;
    this.toolTip = multiValues ? this.displayValue + ' - ' + this.displayValue2 : this.displayValue;
  }

  applyFilter(event: Event, emitChanges?: boolean) {
    // const bDateTime = (this.column.dataType === 'DATETIME');
    // let value = this.inputValue;
    // let value2 = this.inputValue2;
    // if (this.filterType === 'DATE') {
    //   if (!this.timeValue1) {
    //     this.timeValue1 = value ? new Date(value) : this.setTimeToZero();
    //   }
    //
    //   if (!this.timeValue2 && this.selectedOperator.label === 'BETWEEN') {
    //     this.timeValue2 = value2 ? new Date(value2) : this.setTimeToZero();
    //   }
    //
    //   // this bug happens on upstream spel expression construction, we should handle it there
    //   // between case but no date specified
    //   // if (this.selectedOperator.label === 'BETWEEN') {
    //   //   if (!this.inputValue2) {
    //   //     this.inputValue2 = new Date();
    //   //   }
    //   //   if (!this.timeValue2) {
    //   //     this.timeValue2 = this.setTimeToZero();
    //   //   }
    //   // }
    //   this.displayValue = this.formatDateTimeDisplay(bDateTime, this.inputValue, this.timeValue1, this.milliseconds1);
    //   this.displayValue2 = this.formatDateTimeDisplay(bDateTime, this.inputValue2, this.timeValue2, this.milliseconds2);
    //   value = this.formatDateTimeValue(this.inputValue, this.timeValue1, this.milliseconds1);
    //   value2 = this.formatDateTimeValue(this.inputValue2, this.timeValue2, this.milliseconds2);
    // } else if (this.filterType === 'NUMBER') {
    //   value = this.inputValue;
    //   value2 = this.inputValue2;
    //   this.displayValue = this.formatNumber(value);
    //   this.displayValue2 = this.formatNumber(value2);
    // } else {
    //   this.displayValue = this.templateType === 'ENUM' ?
    //     this.column.enumItems.find(i => i.value === this.inputValue)?.label || this.inputValue :
    //     this.inputValue;
    //   this.displayValue2 = this.templateType === 'ENUM' ?
    //     this.column.enumItems.find(i => i.value === this.inputValue2)?.label || this.inputValue2 :
    //     this.inputValue2;
    //
    // }
    //
    // const filterObj = {
    //   colName: this.column.name,
    //   operator: this.selectedOperator.symbol || this.selectedOperator.value['symbol'],  // primeng bug
    //   value,
    //   value2,
    //   colIndex: this.colIndex
    // };
    //
    // this.setToolTip();
    if (emitChanges !== false) {
      // this.filterExpressionChanged.emit(filterObj);
    }
    // setTimeout(() => this.filterPopup.hide());
    // this.resetFocus();
  }

  private setAttr = (selector: any, value: string) => {
    const elem = document.querySelector(`input[name='${selector}']`);
    if (elem) {
      elem.setAttribute('aria-label', value);
    }
  };

  addAriaAttributes() {
    // const setAttr = (selector, value) => {
    //   const elem = document.querySelector(`input[name=\'${selector}\']`);
    //   if (elem) {
    //     elem.setAttribute('aria-label', value);
    //   }
    // };
    //
    // const required =  document.querySelector('input[aria-required');
    // if (required) {
    //   required.setAttribute('aria-required', 'true');
    // }
  }

  onFilterShow() {
    const trigger = document.getElementById('ia-search-run-inline-filter-trigger');
    if (trigger) {
      setTimeout(() => trigger.focus(), 1);
      this.popupHidden = false;
    }
  }

  onFilterHide() {
    this.popupHidden = true;
  }

  addStaticAttributes() {
    const dropdown = document.querySelector('.p-dropdown.p-component');
    if (dropdown) {
      dropdown.setAttribute('role', 'combobox');
      dropdown.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-haspopup', 'listbox');
    }
    this.removeAriaExpandedAttributeFromHiddenInput();
  }

  addAttributes() {
    const filter = document.querySelector('p-dropdown .p-dropdown-items');
    if (filter) {
      filter.setAttribute('aria-label', 'Filter');
    }
    const dropdownOpened = document.querySelector('.p-dropdown.p-component.p-dropdown-open');
    if (dropdownOpened) {
      dropdownOpened.setAttribute('aria-expanded', 'true');
      // PrimeNG sets the selected(focused) option id as p-highlighted-option
      dropdownOpened.setAttribute('aria-activedescendant', 'p-highlighted-option');
    }
  }

  shouldDisplayDash() {
    return this.selectedOperator.label === 'BETWEEN' && (this.displayValue !== '' || this. displayValue2 !== '');
  }

  shoudlHideCloseBtn() {
    return (this.displayValue === '' && this.selectedOperator.label !== 'BETWEEN') ||
      (this.selectedOperator.label === 'BETWEEN' && (this.displayValue === '' && this.displayValue2 === ''));
  }

  resetFocus() {
    setTimeout(() => this.header.nativeElement.focus());
  }

  setTimeToZero() {
    const timeValue = new Date();
    timeValue.setHours(0, 0, 0, 0);

    return timeValue;
  }

  onDate1Select() {
    if (this.inputValue && !this.timeValue1) {
      this.timeValue1 = this.setTimeToZero();
      this.milliseconds1 = 0;
    }
  }

  onDate2Select() {
    if (this.inputValue2 && !this.timeValue2) {
      this.timeValue2 = this.setTimeToZero();
      this.milliseconds2 = 0;
    }
  }

  // formatDateTimeValue(dateVal, timeVal, ms) {
  //   let retVal = '';
  //   if (dateVal) {
  //     if (typeof dateVal === 'string') {
  //       const tmp = dateVal;
  //       dateVal = new Date(tmp);
  //     }
  //     if (typeof timeVal === 'string') {
  //       const tmp = dateVal;
  //       timeVal = new Date(tmp);
  //     }
  //     // timeVal is backed by a date object that includes date
  //     // only interested in the time version of the time input
  //     if (timeVal) {
  //       dateVal.setHours(timeVal.getHours());
  //       dateVal.setMinutes(timeVal.getMinutes());
  //       dateVal.setSeconds(timeVal.getSeconds());
  //     }
  //
  //     // pad 0's for the milliseconds
  //     const dateTimeWithMS = dateVal.setMilliseconds(ms).toString();
  //     const msValue = dateTimeWithMS.substr(dateTimeWithMS.length - 3);
  //
  //     let isoStr = dateVal.toISOString();
  //     isoStr = isoStr.split('.');
  //     isoStr[1] = msValue + 'Z';
  //
  //     retVal =  isoStr.join('.');
  //   }
  //   return retVal;
  // }

  // private formatDateTimeDisplay(isDateTime: boolean, dateVal:string, timeVal:string, ms: number) {
  //   let retVal = '';
  //   if (dateVal === null || dateVal === '') {
  //     return '';
  //   }
  //   const timeValue = this.formatDateTimeValue(dateVal, timeVal, ms);
  //   if (timeValue !== '') {
  //     const locale = this.datetimeService.getCurrentLocale();
  //     const mnemonic = isDateTime ? 'IAMedium' : 'IAShortDate';
  //     const format = this.datePipe.getDateTimeFormat(locale, mnemonic);
  //     retVal = this.datePipe.transform(new Date(timeValue), format);
  //   }
  //
  //   return retVal;
  // }

  isNumber(): boolean {
    return false;
    // return this.applicationSearchService.isNumber(this.column?.dataType);
  }

  clearReadonlyFilterValue() {
    const filterObj = {
      colName: '', //this.column.name,
      operator: '',
      value: '',
      colIndex: this.colIndex
    };
    this.inputValue = this.displayValue = '';
    this.inputValue2 = this.displayValue2 = '';
    this.timeValue1 = null;
    this.timeValue2 = null;
    this.milliseconds1 = 0;
    this.milliseconds2 = 0;
    this.selectedOperator = this.filterOperators[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.filterPopup.hide();
    this.filterExpressionChanged.emit(filterObj);

    if (this.inputEl && this.inputEl.nativeElement) {
      this.inputEl.nativeElement.value = '';
    }
    if (this.inputEl2 && this.inputEl2.nativeElement) {
      this.inputEl2.nativeElement.value = '';
    }
  }

  msInvalid() {
    return ((this.milliseconds1 < 0 || this.milliseconds1 > 999) || (this.milliseconds2 < 0 || this.milliseconds2 > 999));
  }

  onCalendarEsc(event: events) {
    event.stopPropagation();
  }
}
