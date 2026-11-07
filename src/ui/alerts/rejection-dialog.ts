/**
 * Assify Native Alert Dialog Helper
 * Conforms to Apple HIG and Component-First Law
 */

export interface DialogOptions {
  title?: string;
  message: string;
  buttonText?: string;
  onDismiss?: () => void;
}

export function showRejectionAlert(options: DialogOptions): void {
  const title = options.title ?? 'Cannot Analyze Chat';
  const buttonText = options.buttonText ?? 'OK';

  // In React Native / mobile environment:
  // Alert.alert(title, options.message, [{ text: buttonText, onPress: options.onDismiss }]);
  if (typeof globalThis !== 'undefined' && 'Alert' in globalThis) {
    const alertApi = (globalThis as any).Alert;
    alertApi.alert(title, options.message, [{ text: buttonText, onPress: options.onDismiss }]);
  } else {
    // Non-mobile or headless testing fallback
    if (options.onDismiss) options.onDismiss();
  }
}
