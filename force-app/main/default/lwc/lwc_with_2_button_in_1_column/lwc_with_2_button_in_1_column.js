import { LightningElement, wire, api } from 'lwc';
import getContacts from '@salesforce/apex/ContactProjectHelper.getContacts';
import deleteContact from '@salesforce/apex/ContactProjectHelper.deleteContact';
import deleteBulkContact from '@salesforce/apex/ContactProjectHelper.deleteBulkContact';
import { refreshApex } from '@salesforce/apex';

const Columns = [
    { label: 'Id', fieldName: 'Id', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Actions', type: 'customButton' }
]

export default class Lwc_with_2_button_in_1_column extends LightningElement {
    
    columns = Columns;
    contacts;
    displayMessage = '';
    edit_create = '';
    stateHtml = '';
    searchKey= '';
    wiredContactResult;
    error;
    IsModalOpen = false;
    IdToEditRecord;
    selectedContacts = [];
    

    @wire(getContacts,{searchKeyword : '$searchKey'})
    getwiredContacts(result){
        this.wiredContactResult = result;
        const{data, error} = result;
        if(data){
            this.contacts = data.map(contact => {
                let flatcontact = {...contact};
                flatcontact.AccountName = contact.Account.Name;
                flatcontact.AccountUrl = `/lightning/r/Account/${contact.AccountId}/view`;
                return flatcontact;
            });
            console.log('data: ', this.contacts);
            this.error = undefined;
        } else if(error){
            this.contacts = undefined;
            this.error = error;
        }
    }

    handleRowAction(event){
        
        //this.stateHtml = 'Edit';
        //this.edit_create = 'Edit';
        const action = event.detail.action;
        const rowId = event.detail.row.Id;
        switch(action.name){
            case 'edit':
                this.IsModalOpen = true;
                this.IdToEditRecord = rowId;
                
                // this.template.querySelector('#insert_header').innerHTML = htmld;
                break;
            case 'delete':
                this.deleteRecord(rowId);
                break;
            default:
                break;
        }
    }
}