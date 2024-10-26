public with sharing class SanctionsApiService {
    
    private static final String BASE_URL = 'callout:SanctionsAPI_NC/search/';
    private static final String AUTHORIZATION = 'Bearer 73e9ad52-6644-4041-8177-17836326d87b';
    
    @AuraEnabled
    public static String searchSanctions(String name, String dataSource, Decimal minScore) {

        String url = BASE_URL + '?name=' + EncodingUtil.urlEncode(name, 'UTF-8') + '&data_source=' + EncodingUtil.urlEncode(dataSource, 'UTF-8');
        if (minScore != null && minScore > 0.0) {
            url += '&min_score=' + EncodingUtil.urlEncode(String.valueOf(minScore), 'UTF-8');
        }
        

        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');
        req.setHeader('Accept', 'application/json; version=2.2');
        req.setHeader('Authorization', AUTHORIZATION);
        
        Http http = new Http();
        HttpResponse res;
        
        try {
            res = http.send(req);
            if (res.getStatusCode() == 200) {
                // Return the raw JSON response
                return res.getBody();
            } else {
                throw new CalloutException('Failed with status: ' + res.getStatusCode() + ', body: ' + res.getBody());
            }
        } catch (Exception e) {
            System.debug('Error making callout: ' + e.getMessage());
            return 'Error: ' + e.getMessage();
        }
    }
}
