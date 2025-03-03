export class LogoutUseCase {
  async execute(): Promise<void> {
    // No es necesario hacer nada si solo se está eliminando el JWT en el cliente
    // Si trabajas con sesiones o tokens almacenados, puedes invalidar el JWT o limpiar datos aquí.
  }
}
