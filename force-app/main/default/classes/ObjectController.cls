public with sharing class ObjectController {
    @AuraEnabled(cacheable=true)
    public static List<String> getObjectList() {
        List<String> objectNames = new List<String>();
        List<SObject> objects = Database.query('SELECT QualifiedApiName FROM EntityDefinition Order By QualifiedApiName');
        for (SObject obj : objects) {
            objectNames.add((String)obj.get('QualifiedApiName'));
        }
        return objectNames;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getObjectFields(String objectApiName) {
        List<String> fieldNames = new List<String>();
        try {
            String fieldQuery = 'SELECT QualifiedApiName, DataType FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = :objectApiName AND (DataType  Like \'%Lookup%\' OR DataType Like \'%Master-Detail%\') ORDER BY QualifiedApiName';
            List<SObject> fieldResults = Database.query(fieldQuery);
            for (SObject field : fieldResults) {
                    fieldNames.add((String)field.get('QualifiedApiName'));
            }
        } catch (Exception e) {
            System.debug('Error fetching fields: ' + e.getMessage());
        }
        
        return fieldNames;
    }
}