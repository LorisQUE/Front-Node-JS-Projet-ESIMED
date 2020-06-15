const serviceBaseUrl = "http://ec2-3-209-101-117.compute-1.amazonaws.com:3333";

class BaseAPIService {
    constructor(url) {
        this.url = `${serviceBaseUrl}/${url}`;
        this.token = sessionStorage.getItem("token");
        this.headers = new Headers();
        if (this.token !== undefined) {
            this.headers.append("Authorization", `Bearer ${this.token}`);
        }
    };
}