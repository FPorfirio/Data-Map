


function API_call() {

}


API_call.request =  function(url) {       
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest;
        req.onload = function(){
            if(req.status == 200){
                resolve(JSON.parse(req.response));
            }
            else{
                reject(req.statusText);
            }
        }
        req.open('GET', "http://api.worldbank.org/v2/indicators?format=json&pages=50");
        req.send();
    })
}



export {API_call}