import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {asapScheduler, Subject} from "rxjs";

interface dataColumn {
  label: string;
  name: string;
  dataType: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('popupFilter', { static: true }) filterButton: ElementRef;
  title = 'Sample';
  value = 'TEXT';
  eventsSubject: Subject<any> = new Subject<any>();

  columns: dataColumn[] = [
    { label: 'Text Column', dataType: 'TEXT', name: 'TEXT', value: 'TEXT' },
    { label: 'Number Column', dataType: 'NUMBER', name: 'NUMBER', value: 'NUMBER' },
    { label: 'Date Column', dataType: 'DATE', name: 'DATE', value: 'DATE' },
    { label: 'DateTime Column', dataType: 'DATETIME', name: 'DATETIME', value: 'DATETIME' }
  ];

  parentColumn: dataColumn = this.columns[0];

  ngOnInit() {
    return;
  }

  initFilter() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.parentColumn = this.columns.find(col => this.value === col.value);
    const data = {
      column: this.parentColumn
    }
    this.filterButton.nativeElement.style.backgroundColor = 'lightblue';
    asapScheduler.schedule(() => this.filterButton.nativeElement.style.backgroundColor = 'transparent', 1000);
    this.eventsSubject.next( { data });
  }
}
