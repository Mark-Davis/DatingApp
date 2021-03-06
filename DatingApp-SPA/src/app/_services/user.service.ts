import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginationResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getUsers(page?, pageSize?, userParams?, likesParam?): Observable<PaginationResult<User[]>> {
    const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();
    let params = new HttpParams();

    if (page != null) {
      params = params.append('pageNumber', page);
    }
    if (pageSize != null) {
      params = params.append('pageSize', pageSize);
    }
    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('lookingFor', userParams.lookingFor);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.httpClient.get<User[]>(this.baseUrl + 'users', {observe: 'response', params: params})
      .pipe(
        map(response => {
          paginationResult.result = response.body;
          const paginationHeader = response.headers.get('Pagination');
          if (paginationHeader != null) {
              paginationResult.pagination = JSON.parse(paginationHeader);
          }
          return paginationResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.httpClient.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.httpClient.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.httpClient.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(userId: number, recipientId: number) {
    return this.httpClient.post(this.baseUrl + 'users/' + userId + '/like/' + recipientId, {});
  }

  getMessages(userId: number, page?, itemsPerPage?, messageContainer?) {
    const paginationResult: PaginationResult<Message[]> = new PaginationResult<Message[]>();
    let params = new HttpParams();

    if (page != null) {
      params = params.append('pageNumber', page);
    }
    if (itemsPerPage != null) {
      params = params.append('pageSize', itemsPerPage);
    }
    if (messageContainer != null) {
      params = params.append('messageContainer', messageContainer);
    }

    return this.httpClient.get<Message[]>(this.baseUrl + 'users/' + userId + '/messages', {observe: 'response', params})
      .pipe(
        map(response => {
          paginationResult.result = response.body;
          const paginationHeader = response.headers.get('Pagination');
          if (paginationHeader != null) {
            paginationResult.pagination = JSON.parse(paginationHeader);
          }
          return paginationResult;
        })
      );
  }

  getMessageThread(userId: number, recipientId: number) {
    return this.httpClient.get<Message[]>(this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.httpClient.post(this.baseUrl + 'users/' + id + '/messages/', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.httpClient.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(id: number, userId: number) {
    return this.httpClient.post(this.baseUrl + 'users/' + userId + '/message/' + id + '/read', {});
  }
}
