import { DataHelper } from 'adapter/helper/data.helper';
import { OTransaction, Transaction } from '../model/transaction.model';
import { ClientFactory } from './client.factory';
import { PrestationFactory } from './prestation.factory';

export abstract class TransactionFactory {
  static getTransaction(transaction: Transaction): OTransaction {
    if (transaction) {
      return {
        id: transaction.id,
        type: transaction.type,
        description: transaction.description,
        client: ClientFactory.getClient(transaction.client), // Conversion pour utiliser l'ID du client depuis l'entité
        prestation: PrestationFactory.getPrestation(transaction.subscription?.prestation!),
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      };
    }
    return null as any;
  }

  /**
   * Transforme une liste d'entités de transactions de transactions en modèles
   * @param transactions Liste des entités PointTransaction
   * @returns Liste des modèles PointTransaction
   */
  static getTransactions(transactions: Transaction[]): OTransaction[] {
    if (DataHelper.isNotEmptyArray(transactions)) {
      return transactions.map(this.getTransaction);
    }
    return [];
  }
}
