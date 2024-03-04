/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import * as firebaseConfig from './firebase.config.json';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Message, TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';

const firebaseInfo = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url,
};

@Injectable()
export class FirebaseService {
  logger: Logger = new Logger(FirebaseService.name);

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseInfo),
    });
  }
  
  async sendMessage(message: TokenMessage) {
    if (message.token) await admin.messaging().send(message);
  }

  // 토큰 검증
  async authTokenVerify(idToken: string): Promise<DecodedIdToken> {
    const checkRevoked = true;
    try {
      const payload = await admin.auth().verifyIdToken(idToken, checkRevoked);
      // this.logger.debug("verify success ::", payload)
      return payload;
    } catch (error) {
      this.logger.error(error);
      if (error.code === 'auth/id-token-revoked') {
        // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
        throw new HttpException('Token is revoked.', HttpStatus.FORBIDDEN);
      } else {
        // Token is invalid.
        throw new HttpException('Token is invalid.', HttpStatus.FORBIDDEN);
      }
    }
  }

  // 토큰 만료
  async expireToken(uid: string): Promise<object> {
    this.logger.debug(uid);
    await admin.auth().revokeRefreshTokens(uid);

    // revoke 시간 확인
    const userRecord = await admin.auth().getUser(uid);
    const timestamp =
      new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
    this.logger.debug(`Tokens revoked at: ${timestamp}`);

    return userRecord;
  }

  // uid 유저 찾기
  async getUserByUid(uid: string): Promise<UserRecord> {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Error fetching user data', HttpStatus.NOT_FOUND);
    }
  }

  // 계정 삭제
  async delUserByUid(uid: string[]): Promise<any> {
    try {
      return await admin.auth().deleteUsers(uid);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
