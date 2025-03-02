import { DataHelper } from 'adapter/helper/data.helper';
import { OSupportTicket, SupportTicket } from '../model/transaction.model';
import { ClientFactory } from './client.factory';

export abstract class TransactionFactory {
  static getTransaction(transaction: SupportTicket): OSupportTicket {
    if (transaction) {
      return {
        id: transaction.id,
        type: transaction.type,
        description: transaction.description,
        client: ClientFactory.getClient(transaction.client), // Conversion pour utiliser l'ID du client depuis l'entité
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
  static getTransactions(transactions: SupportTicket[]): OSupportTicket[] {
    if (DataHelper.isNotEmptyArray(transactions)) {
      return transactions.map(this.getTransaction);
    }
    return [];
  }
}
