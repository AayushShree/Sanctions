import { LightningElement, track } from 'lwc';
import getObjectList from '@salesforce/apex/ObjectController.getObjectList';
import getObjectFields from '@salesforce/apex/ObjectController.getObjectFields';
import searchSanctions from '@salesforce/apex/SanctionsApiService.searchSanctions';

export default class Lwc_picklist_tab extends LightningElement {
    selectedObject;
    selectedField;
    fields = [];
    objectOptions = [];
    fieldOptions = [];
    name='';
    dataSurce='';
    searchResult;

    dataSourceOptions = [
            { label: 'United Nations', value: 'UN' },
            { label: 'World Bank', value: 'WB - DFI' },
            { label: 'World Bank', value: 'WB - CDF' },
            { label: 'Asian Development Bank', value: 'ADB'},
            { label: 'OFAC', value: 'SDN' },
            { label: 'HM Treasury', value: 'HM TREASURY' },
            { label: 'OFAC-NONSDN', value: 'NONSDN' }
    ];

    connectedCallback() {
        this.fetchObjectList();
    }

    fetchObjectList() {
        getObjectList()
            .then(result => {
                this.objectOptions = result.map(objName => ({
                    label: objName,
                    value: objName
                }));
                //console.log('objectOptions:..', this.objectOptions);  
            })
            .catch(error => {
                console.error('Error fetching object list', error);
            });
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        this.fetchObjectFields(this.selectedObject);
    }

    fetchObjectFields(objectApiName) {
        getObjectFields({ objectApiName })
            .then(result => {
                this.fields = result;
                //console.log('fields..:', this.fields);
                this.fieldOptions = result.map(field=>({
                    label: field,
                    value: field
                    // value: Field[fieldName] // If you want to use the actual field object, uncomment this line and comment out the previous line
                }));
                console.log('fieldsOptins:..', this.fieldOptions); 
            })
            .catch(error => {
                console.error('Error fetching fields', error);
            });
    }

    handleFieldSelect(event) {
        this.selectedField = event.detail.value;
        console.log('this.selectedField', this.selectedField);
    }

    handleLoginClick(){
        window.open('https://www.sanctions.io', '_blank');
    }
    handleNameChange(event) {
        this.name = event.target.value;
    }

    // handleDataSourceChange(event) {
    //     this.dataSource = event.target.value;
    // }
    handleDataSourceChange(event) {
        this.selectedDataSources = event.detail.value;
    }

    handleMinScoreChange(event) {
        const value = parseFloat(event.target.value);
        if (value > 1.0) {
            this.minScore = '1.0';  // Limit max value to 1.0
        } else if (value >= 0.0) {
            this.minScore = event.target.value;
        }
    }

    // handleSearchClick() {
    //     if (this.name && this.dataSource) {
    //         searchSanctions({ name: this.name, dataSource: this.dataSource })
    //             .then(result => {
    //                 this.searchResult = result;
    //             })
    //             .catch(error => {
    //                 this.searchResult = 'Error: ' + error.body.message;
    //             });
    //     } else {
    //         this.searchResult = 'Please provide both name and data source';
    //     }
    // }

    handleSearchClick() {
        if (this.name && this.selectedDataSources.length > 0) {
            const dataSourceString = this.selectedDataSources.join(',');

            let minScoreValue = parseFloat(this.minScore);
            
            if (isNaN(minScoreValue) || minScoreValue < 0.0 || minScoreValue > 1.0) {
                minScoreValue = null; 
            }

            searchSanctions({ 
                name: this.name, 
                dataSource: dataSourceString,
                minScore: minScoreValue
            })
                .then(result => {
                    this.searchResult = result;
                    this.prettyJsonResult = JSON.stringify(JSON.parse(result), null, 2);
                })
                .catch(error => {
                    this.searchResult = 'Error: ' + error.body.message;
                    this.prettyJsonResult = '';
                });
        } else {
            this.searchResult = 'Please provide both name and at least one data source';
            this.prettyJsonResult = '';
        }
    }
}