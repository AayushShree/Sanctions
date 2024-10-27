# Salesforce DX Project: Integration of Salesforce org with External Site and Display Using LwC.
(Using Named Cred but currently auth through apex, will change auth setting in update using named cred principals and headers).

Crux:- In this project we are fetching data from the Sanctions website using its rest base api and displaying the json response in our lightning data table.

Detail:
1. Created a lwc tab.
2. Created a LwC component to display in the lwc tab.
3. The component consits of 3 tabs.
4. Tab1 has functionality to set up account for sanctions site.
5. Tab2 is currently not much defined.
6. Tab3 has the search functionality set up to search through sanctions data base directly from your salesforce org and have it display the required results using the familiar LightningDataTable.
7. The data is fetched using api call through http request made using apex class and this function is imported in js of lwc to recieve the raw json data which is then parsed and the resulting       array is mapped to display the result as per the requirement.

////Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
