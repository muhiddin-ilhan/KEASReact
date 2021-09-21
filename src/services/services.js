import AppConstant from "../constant/app_constant";
import { isEmptyObject } from "jquery";
import { SwAlertToast } from "../components/SweetAlert";

export async function DoLogin(username, password, url) {
    const requestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        body: JSON.stringify({
            Identity: username,
            Password: password
        }),
    };

    const response = await (await fetch(AppConstant.BASE_URL + url, requestOption)).json();

    if (!isEmptyObject(response)) {
        if (response.LoginResult.IsSuccess) {
            return response;
        } else {
            SwAlertToast({ icon: 'error', title: response.LoginResult.ResultMessage });
            return "Error";
        }
    } else {
        SwAlertToast({ icon: 'error', title: "Bir Hata Oluştu. Bağlantınızı Kontrol Edin Lütfen" });
        return "Error";
    }
}

export async function DoRegister(name, surname, email, password) {
    const requestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        body: JSON.stringify({
            Name: name,
            SurName: surname,
            Email: email,
            Password: password
        }),
    };

    const response = await (await fetch(AppConstant.BASE_URL + "/Authentication/Register", requestOption)).json();

    if (!isEmptyObject(response)) {
        if (response.IsSuccess) {
            if (response.ResultMessage !== null) {
                SwAlertToast({ icon: 'success', title: response.ResultMessage });
            }
            return response;
        } else {
            SwAlertToast({ icon: 'error', title: response.ResultMessage });
            return "Error";
        }
    } else {
        SwAlertToast({ icon: 'error', title: "Bir Hata Oluştu. Bağlantınızı Kontrol Edin Lütfen" });
        return "Error";
    }
}

export async function HttpRequest(data, url) {

    if (localStorage.getItem("user") === undefined || localStorage.getItem("user") === null) return "goLogin";

    const userInfo = JSON.parse(localStorage.getItem("user"));
    const userToken = userInfo.Token;

    if (userToken === undefined || userToken === null || userToken === "") return "goLogin";

    const requestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Token: userToken,
            Identity: userInfo.Identity,
            DeviceId: "Web"
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(AppConstant.BASE_URL + url, requestOption);

    if (response.status === 200) {
        const respJson = await response.json();
        return respJson;
    } else if (response.status === 400) {
        return "goLogin";
    } else {
        SwAlertToast({ icon: 'error', title: "Bir Hata Oluştu. Bağlantınızı Kontrol Edin Lütfen" });
        return "Error";
    }

}

export async function BmsGetRoute(origin, destination) {
    const data = {
        origin: origin,
        destination: destination,
        wayPoints: "",
        addRestDuration: true,
        restDuration: 45,
        requestOptions: {
            liveTraffic: false,
            alternativeRoute: false,
            alternativeCount: 0,
            snapMaxDistance: 20000,
            costType: 1,
            isCar: false,
            isTruck: true,
            isPedestrian: false,
            avoidToolRoad: false,
            avoidHighway: false,
            useFerry: false,
            avoidPrivateRoad: false,
            avoidRestrictedRoad: false,
            useBoat: false,
            isBus: false,
            getManifest: false
        }
    }

    const requestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch("https://services.basarsoft.com.tr/api/Basar/BasarRouting?apiKey=e59c720692894f0ea9015679f4aa3dbc", requestOption);

    if (response.status === 200) {
        const respJson = await response.json();
        return respJson;
    } else {
        SwAlertToast({ icon: 'error', title: "Bir Hata Oluştu. Bağlantınızı Kontrol Edin Lütfen" });
        return "Error";
    }

}

