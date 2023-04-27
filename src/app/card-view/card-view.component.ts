import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from "primeng/api";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

type MODE = 'grid' | 'list';
interface SELECT {
  icon: string;
  view: string;
  title: string;
  id: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})

export class CardViewComponent implements OnInit{
  items: MenuItem[] = [];

  gridViewConfig: SELECT = {
    icon: 'icon-cardview',
    view: 'grid',
    title: 'Tile View',
    ariaLabel: 'CARD',
    id: 'ia-card-button'
  };
  listViewConfig: SELECT = {
    icon: 'icon-listview',
    view: 'list',
    ariaLabel: 'TILE',
    title: 'List View',
    id: 'ia-list-button'
  };

  viewSelection: SELECT = this.gridViewConfig;
  viewOptions = [this.gridViewConfig, this.listViewConfig];

  applications: any = [{
    "createdBy": "sue@iacustomer.com",
    "createdDate": "2023-04-27T00:52:01.353Z",
    "lastModifiedBy": "sue@iacustomer.com",
    "lastModifiedDate": "2023-04-27T00:52:02.387Z",
    "version": 2,
    "id": "a554064b-7b32-4ebc-9c61-681be59028f4",
    "name": "PhoneCalls",
    "tenant": "http://localhost:8080/restapi/systemdata/tenants/ac3a066e-b52b-42ba-bf9f-b96fe98ddde5",
    "type": "APP_DECOMM",
    "archiveType": "SIP",
    "searchCreated": true,
    "state": "IN_TEST",
    "cacheState": "CACHED_IN",
    "viewStatus": true,
    "description": "This application archives customer support calls. This SIP application demonstrates how to configure a holding to apply retention automatically to the package on ingestion, and includes encryption and unstructured data.",
    "category": "Example Application",
    "retentionEnabled": false,
    "defaultRetentionPolicyName": null,
    "cryptoIV": "OCQ5C16HzRkMZmEymDJnNA==",
    "metadataCacheSize": 0,
    "permission": {
      "groups": []
    }
  }, {
    "createdBy": "sue@iacustomer.com",
    "createdDate": "2023-04-27T00:52:01.353Z",
    "lastModifiedBy": "sue@iacustomer.com",
    "lastModifiedDate": "2023-04-27T00:52:02.387Z",
    "version": 2,
    "id": "a554064b-7b32-4ebc-9c61-681be59028f4",
    "name": "PhoneCalls",
    "tenant": "http://localhost:8080/restapi/systemdata/tenants/ac3a066e-b52b-42ba-bf9f-b96fe98ddde5",
    "type": "ACTIVE_ARCHIVING",
    "archiveType": "SIP",
    "searchCreated": true,
    "state": "CACHED_OUT",
    "cacheState": "CACHED_IN",
    "viewStatus": true,
    "description": "This application archives customer support calls. This SIP application demonstrates how to configure a holding to apply retention automatically to the package on ingestion, and includes encryption and unstructured data.",
    "category": "Example Application",
    "retentionEnabled": false,
    "defaultRetentionPolicyName": null,
    "cryptoIV": "OCQ5C16HzRkMZmEymDJnNA==",
    "metadataCacheSize": 0,
    "permission": {
      "groups": []
    }
  }, {
    "createdBy": "sue@iacustomer.com",
    "createdDate": "2023-04-27T00:52:01.353Z",
    "lastModifiedBy": "sue@iacustomer.com",
    "lastModifiedDate": "2023-04-27T00:52:02.387Z",
    "version": 2,
    "id": "a554064b-7b32-4ebc-9c61-681be59028f4",
    "name": "PhoneCalls",
    "tenant": "http://localhost:8080/restapi/systemdata/tenants/ac3a066e-b52b-42ba-bf9f-b96fe98ddde5",
    "type": "APP_DECOMM",
    "archiveType": "SIP",
    "searchCreated": true,
    "state": "IN_TEST",
    "cacheState": "CACHED_IN",
    "viewStatus": true,
    "description": "This application archives customer support calls. This SIP application demonstrates how to configure a holding to apply retention automatically to the package on ingestion, and includes encryption and unstructured data.",
    "category": "Example Application",
    "retentionEnabled": false,
    "defaultRetentionPolicyName": null,
    "cryptoIV": "OCQ5C16HzRkMZmEymDJnNA==",
    "metadataCacheSize": 0,
    "permission": {
      "groups": []
    }
    }, {
    "createdBy": "sue@iacustomer.com",
    "createdDate": "2023-04-27T00:52:01.353Z",
    "lastModifiedBy": "sue@iacustomer.com",
    "lastModifiedDate": "2023-04-27T00:52:02.387Z",
    "version": 2,
    "id": "a554064b-7b32-4ebc-9c61-681be59028f4",
    "name": "PhoneCalls",
    "tenant": "http://localhost:8080/restapi/systemdata/tenants/ac3a066e-b52b-42ba-bf9f-b96fe98ddde5",
    "type": "ACTIVE_ARCHIVING",
    "archiveType": "SIP",
    "searchCreated": true,
    "state": "IN_TEST",
    "cacheState": "CACHED_IN",
    "viewStatus": true,
    "description": "This application archives customer support calls. This SIP application demonstrates how to configure a holding to apply retention automatically to the package on ingestion, and includes encryption and unstructured data.",
    "category": "Example Application",
    "retentionEnabled": false,
    "defaultRetentionPolicyName": null,
    "cryptoIV": "OCQ5C16HzRkMZmEymDJnNA==",
    "metadataCacheSize": 0,
    "permission": {
      "groups": []
    }
  }, {
    "createdBy": "sue@iacustomer.com",
    "createdDate": "2023-04-27T00:52:01.353Z",
    "lastModifiedBy": "sue@iacustomer.com",
    "lastModifiedDate": "2023-04-27T00:52:02.387Z",
    "version": 2,
    "id": "a554064b-7b32-4ebc-9c61-681be59028f4",
    "name": "PhoneCalls",
    "tenant": "http://localhost:8080/restapi/systemdata/tenants/ac3a066e-b52b-42ba-bf9f-b96fe98ddde5",
    "type": "ACTIVE_ARCHIVING",
    "archiveType": "SIP",
    "searchCreated": true,
    "state": "CACHED_OUT",
    "cacheState": "CACHED_IN",
    "viewStatus": true,
    "description": "This application archives customer support calls. This SIP application demonstrates how to configure a holding to apply retention automatically to the package on ingestion, and includes encryption and unstructured data.",
    "category": "Example Application",
    "retentionEnabled": false,
    "defaultRetentionPolicyName": null,
    "cryptoIV": "OCQ5C16HzRkMZmEymDJnNA==",
    "metadataCacheSize": 0,
    "permission": {
      "groups": []
    }
  }, {
    "createdBy": "sue@iacustomer.com",
    "createdDate": "2023-04-27T00:52:01.353Z",
    "lastModifiedBy": "sue@iacustomer.com",
    "lastModifiedDate": "2023-04-27T00:52:02.387Z",
    "version": 2,
    "id": "a554064b-7b32-4ebc-9c61-681be59028f4",
    "name": "PhoneCalls",
    "tenant": "http://localhost:8080/restapi/systemdata/tenants/ac3a066e-b52b-42ba-bf9f-b96fe98ddde5",
    "type": "ACTIVE_ARCHIVING",
    "archiveType": "SIP",
    "searchCreated": true,
    "state": "IN_TEST",
    "cacheState": "CACHED_IN",
    "viewStatus": true,
    "description": "This application archives customer support calls. This SIP application demonstrates how to configure a holding to apply retention automatically to the package on ingestion, and includes encryption and unstructured data.",
    "category": "Example Application",
    "retentionEnabled": false,
    "defaultRetentionPolicyName": null,
    "cryptoIV": "OCQ5C16HzRkMZmEymDJnNA==",
    "metadataCacheSize": 0,
    "permission": {
      "groups": []
    }
  }];

  constructor(private messageService: MessageService) {}

  isApplicationOnline(app: any) {
    return true;
  }

  update() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
  }

  delete() {
    this.messageService.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
  }
  ngOnInit() {
    this.items = [{
      label: 'Edit Application',
      icon: 'pi pi-pencil',
      command: () => {
        this.update();
      }
    }, {
      label: 'Export Application',
      icon: 'pi pi-download',
      command: () => {
        this.update();
      }
    }, {
      label: 'Delete Application',
      icon: 'pi pi-times',
      command: () => {
        this.delete();
      }
    }];
  }

}
