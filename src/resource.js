import isArray from 'lodash/isArray';
import { trimSlashes } from './utils';
import * as validators from './validators';

export default class RestClientResource {
    constructor(restClient, path) {
        validators.isValidRestClientInstance(restClient);
        validators.isValidResource(path);

        this._restClient = restClient;
        this._path = trimSlashes(path);
    }
    getRestClient() {
        return this._restClient;
    }
    newResource(path) {
        return new RestClientResource(this._restClient, path);
    }
    request(urlParam, options) {
        validators.isValidRequestUrlParam(urlParam);
        const pathIsArray = isArray(urlParam);

        return this._restClient.request(
            [
                `/${this._path}/${trimSlashes(pathIsArray ? urlParam[0] : urlParam)}`,
                pathIsArray ? urlParam[1] : null
            ],
            options
        );
    }
    list(queryParams, options) {
        return this._restClient.request(
            [this._buildResourcePath(this._path), queryParams],
            Object.assign({}, options, { method: 'GET' })
        );
    }
    get(id, queryParams, options) {
        return this._restClient.request(
            [this._buildResourcePath([this._path, id]), queryParams],
            Object.assign({}, options, { method: 'GET' })
        );
    }
    create(body, queryParams, options) {
        return this._restClient.request(
            [this._buildResourcePath(this._path), queryParams],
            Object.assign({}, options, { method: 'POST', body })
        );
    }
    update(id, body, queryParams, options) {
        return this._restClient.request(
            [this._buildResourcePath([this._path, id]), queryParams],
            Object.assign({}, options, { method: 'PUT', body })
        );
    }
    remove(id, queryParams, options) {
        return this._restClient.request(
            [this._buildResourcePath([this._path, id]), queryParams],
            Object.assign({}, options, { method: 'DELETE' })
        );
    }
    _buildResourcePath(path) {
        return isArray(path) ? `/${path.map(part => encodeURIComponent(part)).join('/')}` : `/${path}`;
    }
}
