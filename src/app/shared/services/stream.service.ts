import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { GetValidAccessTokenUseCase } from 'src/app/domain/business/GetValidAccessToken.business';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor(private getValidToken: GetValidAccessTokenUseCase) { }
  
streamResponse(url: string, body: any) {
  const subject = new Subject<string>();

  (async () => {
    try {
      const accessToken =
        (await firstValueFrom(this.getValidToken.execute())) ?? '';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      });

      if (!response.body) {
        subject.error('No response body');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const readChunk = () => {
        reader.read().then(({ value, done }) => {
          if (done) {
            subject.complete();
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          subject.next(chunk);

          readChunk();
        }).catch(err => subject.error(err));
      };

      readChunk();

    } catch (err) {
      subject.error(err);
    }
  })();

  return subject.asObservable();
}
}
