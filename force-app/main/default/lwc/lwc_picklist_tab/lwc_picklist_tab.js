import { LightningElement, track } from 'lwc';
import getObjectList from '@salesforce/apex/ObjectController.getObjectList';
import getObjectFields from '@salesforce/apex/ObjectController.getObjectFields';
import searchSanctions from '@salesforce/apex/SanctionsApiService.searchSanctions';

export default class Lwc_picklist_tab extends LightningElement {
    selectedObject;
    resultingarray=[];
    countResult;
    parsedData
    selectedField;
    fields = [];
    objectOptions = [];
    fieldOptions = [];
    name='';
    dataSurce='';
    searchResult;
    tableData = [];
    sortedBy;
    sortedDirection;

    dataSourceOptions = [
            { label: 'United Nations', value: 'UN' },
            { label: 'World Bank', value: 'WB - DFI' },
            { label: 'World Bank', value: 'WB - CDF' },
            { label: 'Asian Development Bank', value: 'ADB'},
            { label: 'OFAC', value: 'SDN' },
            { label: 'HM Treasury', value: 'HM TREASURY' },
            { label: 'OFAC-NONSDN', value: 'NONSDN' }
    ];

    columns = [
        //{label: 'S.No', fieldName: 'serialNumber', type: 'number', sortable:true},
        {label: 'SI Indentifier', fieldName: 'si_Identifier', type:'text', sortable:true},
        {label: 'Confidence Score', fieldName:'confidence_score', type:'text', sortable:true},
        {label: 'Name', fieldName: 'name', type:'text', sortable:true},
        {label: 'Alternate Names', fieldName: 'alt_names', type:'text', sortable:true},
        {label: 'Entity Type', fieldName: 'entity_type', type:'text', sortable:true},
        {label: 'Entity Number', fieldName:'entity_number', type:'number', sortable:true},
        {label: 'Gender', fieldName:'gender', type:'text', sortable:true},
        {label: 'Address', fieldName:'address', type:'text'},
        {label: 'Data Source', fieldName: 'data_source', type:'text', sortable:true},
        // {label: '', fieldName:'regime', type:'text', sortable:true, wrapText:true},
        // {label: '', fieldName:'date_designated', type:'text', sortable:true, wrapText:true},
        // {label: '', fieldName:'data_hash', type:'text', wrapText:true},
    ]

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
                    // this.prettyJsonResult = JSON.stringify(JSON.parse(result), null, 2);
                    console.log('result in handle search', result);
                    console.log('json parsed in searchclick', JSON.parse(result));

                    //newcodeAG
                    let parsedData = JSON.parse(result);  // Parse the JSON string
                    console.log('Parsed JSON data:', parsedData);

                    this.setData(parsedData);  // Set data for datatable
                    //newcodeAGdone
                    //this.setData(result);
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

    // setData(jsonData){
    //     console.log('jsonData in set Data', jsonData);
    //     this.resultingarray = jsonData.results;
    //     console.log('resulting array', this.resultingarray);
    //     try{
    //         // this.tableData = jsonData;
    //         //  console.log('resultingarray in try: ', this.resultingarray);
    //         this.tableData = this.resultingarray.map((item) => {
    //             return{
    //                 // serialNumber: index + 1,
    //                 // si_identifier: item.results.si_identifier || 'N/A',
    //                 // entity_number: item.results.entity_number||'N/A',
    //                 // position: item.results.additional_information && item.results.additional_information.position ? item.results.additional_information.position :'N/A',
    //                 // gender: item.results.additional_information && item.results.additional_information.gender ? item.results.additional_information.gender :'N/A',
    //                 // last_updated: item.results.additional_information && item.results.additional_information.last_updated ? item.results.additional_information.last_updated : 'N/A',
    //                 // regime: item.results.additional_information && item.results.additional_information.regime ? item.results.additional_information.regime.join(', ') : 'N/A',
    //                 // date_designated: item.results.additional_information && item.results.additional_information.date_designated ? item.results.additional_information.date_designated.join(', '): 'N/A',
    //                 // data_hash: item.results.data_hash || 'N/A'                    
    //                 //serialNumber: index+1,
    //                 si_identifier: item.si_identifier,
    //                 entity_number: item.entity_number,
    //                 confidence_score: item.confidence_score,
    //                 gender: item.gender,
    //                 address: item.address,
    //             };
    //         });
    //         console.log('this.tableData mapped', this.tableData);
    //     }
    //     catch(error){
    //         console.error('Error parsing/mapping JSON data', error);
    //         // this.tableData = [];
    //         // this.sortedBy = null;
    //         // this.sortedDirection = null;  // Reset sorting state when error occurs.  If you want to keep the current sorting state, comment out this line.  It will reset the sorting order on each error.  If you want to keep the previous sorting state, uncomment this line and comment out the previous line.  It will maintain the previous sorting order on each error.  You may need to update the sorting logic accordingly.  For example, if you want to keep the previous sorting order on each error, you can keep a copy of the original data and sort it on the client-side, then update the tableData with the sorted data.  If you want to reset the sorting order on each error, you can reset the tableData to the original data.  It depends on your specific use case.  You may need to make some adjust
    //     }
    // }

    //newcodeAG
    setData(jsonData) {
        console.log('jsonData in set Data', jsonData);
        this.resultingarray = jsonData.results;
        console.log('resulting array', this.resultingarray);
    
        try {
            this.tableData = this.resultingarray.map((item, index) => {
                return {
                    //serialNumber: index + 1,  
                    si_Identifier: item.si_identifier || 'N/A',
                    entity_number: item.entity_number || 'N/A',
                    confidence_score: item.confidence_score || 'N/A',
                    gender: item.gender || 'N/A',
                    address: item.address ? item.address.join(', ') : 'N/A',
                    name: item.name || 'N/A',  
                    alt_names: item.alt_names ? item.alt_names.join(', ') : 'N/A',
                    entity_type: item.entity_type || 'N/A',
                    data_source: item.data_source ? item.data_source.name || 'N/A' : 'N/A',
                };
            });
            console.log('this.tableData mapped', this.tableData);
        } catch (error) {
            console.error('Error parsing/mapping JSON data', error);
        }
    }


    handleSort(event){
        const { fieldName: sortedBy, sortedDirection} = event.detail;
        const cloneData = [...this.tableData];

        cloneData.sort((a, b) => {
            let fieldA = a[sortedBy];
            let fieldB = b[sortedBy];
            if(typeof fieldA == 'string'){
                fieldA = fieldA.toLowerCase();
                fieldB = fieldB.toLowerCase();
            }
            return sortedDirection === 'asc' ? (fieldA>fieldB?1:-1) : (fieldA<fieldB?1:-1);
        });
        this.tableData = cloneData;
        this.sortedBy = sortedBy;
        this.sortedDirection = sortedDirection;
    }
}