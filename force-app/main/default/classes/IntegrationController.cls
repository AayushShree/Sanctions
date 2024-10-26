public class IntegrationController {
    private static final String ENDPOINT_URL = 'callout:IntegrationNC/services/apexrest/Account/';

    public static List<Account> getAccounts(){
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(ENDPOINT_URL);
        req.setHeader('Accept', 'application/json');
        req.setMethod('GET');
        HttpResponse response = http.send(req);
        if(response.getStatusCode()==200){
            return (List<Account>)JSON.deserialize(response.getBody(), List<Account>.class);
        }
        else{
            return null;
        }
    }

    public static String updateAccount(String accId, String uName, Decimal uAnnualRevenue, String uType, String uRating){
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(ENDPOINT_URL+accId);
        req.setHeader('content-type', 'applications/json; charset=UTF-8');
        req.setMethod('PUT');
        Map<String, Object> updateFields = new Map<String, Object>();
        if(uName!=null) updateFields.put('NameA', uName);
        if(uAnnualRevenue!=null) updateFields.put('AnnualRevenueA', String.valueOf(uAnnualRevenue));
        if(uType!=null) updateFields.put('TypeA', uType);
        if(uRating != null) updateFields.put('RatingA', uRating);
        String requestBody = JSON.serialize(updateFields);
        req.setBody(requestBody);
        HttpResponse response = http.send(req);
		//if(response.getStatusCode()==200){    
        	return String.valueOf(response.getStatusCode());
        //}
        
    }
    
    public static String createAccount(String uName, String uAnnualRevenue, String uType, String uRating){
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        req.setEndpoint(ENDPOINT_URL);
        req.setHeader('content-type', 'application/json; charset=UTF-8');
        Map<String, Object> createAcc = new Map<String, Object>();
        if(uName!=null || uName != ''){
            createAcc.put('NameA', uName);
        }
        else{
            createAcc.put('NameA', '');
        }
        if(uAnnualRevenue!=null || uAnnualRevenue != ''){
            createAcc.put('AnnualRevenueA', uAnnualRevenue);
        }
        else{
            createAcc.put('AnnualRevenueA', '');
        }
        if(uType!=null || uType != ''){
            createAcc.put('TypeA', uType);
        }
        else{
            createAcc.put('TypeA', '');
        }
		if(uRating!=null || uRating != ''){
            createAcc.put('RatingA', uRating);
        }
        else{
            createAcc.put('RatingA', '');
        }
        String requestBody = JSON.serialize(createAcc);
        req.setBody(requestBody);
        HttpResponse response = http.send(req);
        System.debug('response.getStatusCode() :' + response.getStatusCode());
		return String.valueOf(response.getStatusCode());
    }
    
    public static String deleteAccount(String accId){
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(ENDPOINT_URL+accId);
        req.setHeader('content-type', 'applications/json; charset=UTF-8');
        req.setMethod('DELETE');
        HttpResponse response = http.send(req);
        System.debug('response.getStatusCode() :' + response.getStatusCode());
        return String.valueOf(response.getStatusCode());
        
    }
}