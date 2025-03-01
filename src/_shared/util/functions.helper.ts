function formatFullName(firstname: string, lastname: string): string {
  if (firstname || lastname) {
    const upperLastName = lastname.toUpperCase();
    const fullName = `${upperLastName} ${firstname}`;
    return fullName;
  }
  return '';
}

export { formatFullName };
