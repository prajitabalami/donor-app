import { AsyncStorage } from 'react-native';

const base_url = "localhost:3001/api/user/"

const getOtp = (number,email) => {
    const url = 'signup';
    const method = 'POST';
    console.log('Calling get phn number:')
    const body = JSON.stringify({
        number:number,
        email:email
    })
    console.log("request data", JSON.stringify({
        number:number,
        email:email
    }))

    return (call_api(url, method, body))

}

const addDonor = (name, number, blood_group, latitude, longitude, availability, donate_blood, donate_plasma, donate_cov_plasma, cov_recov) => {
    const url = 'api/user/create';
    const method = 'POST';
    const body = JSON.stringify({
        name: name,
        number: number,
        blood_group: blood_group,
        latitude: latitude,
        longitude: longitude,
        availability: availability,
        donate_blood: donate_blood,
        donate_plasma: donate_plasma,
        donate_cov_plasma: donate_cov_plasma,
        cov_recov: cov_recov,


    })


    console.log("request data", JSON.stringify({
        name: name,
        number: number,
        blood_group: blood_group,
        latitude: latitude,
        longitude: longitude,
        availability: availability,
        donate_blood: donate_blood,
        donate_plasma: donate_plasma,
        donate_cov_plasma: donate_cov_plasma,
        cov_recov: cov_recov,

    }))
    console.log('calling addDonor')
    return (call_api(url, method, body))
}





const call_api = async (url, method, body) => {


    if (method === 'POST') {
        console.log('calling api path', base_url + url)
        try {
            console.log("yah pugyo")
            let response = await fetch(base_url + url, {
                method: 'POST',
                body: body,
            });

            let responseJson = await response.json();
            console.log('responseJson', responseJson);

            return responseJson;
        }


        catch (error) {

            console.log(error);
            console.log("IDK what is this error")
        }
    }
    if (method === 'GET') {
        console.log('method get reached here');
        try {
            let response = await fetch(base_url + url, {
                method: 'GET',


            });

            let result = await response.json();
            console.log('responseJson', result);

            return result;
        }
        catch (error) {
            console.log(error);
        }
    }

    else if (method === 'PUT') {
        try {
            let response = await fetch(base_url + url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            });
            let responseJson = await response.json();
            console.log('responseJson', responseJson);
            return responseJson;
        }
        catch (error) {
            console.log(error)
        }
    }

    else if (method === 'DELETE') {
        try {
            let response = await fetch(base_url + url, {
                method: 'DELETE',

            });
            let responseJson = await response.json();
            console.log('responseJson', responseJson);
            return responseJson;
        }
        catch (error) {
            console.log(error)
        }
    }
}

export {
    addDonor,
    getOtp,
}