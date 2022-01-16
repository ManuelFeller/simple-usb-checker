export default class AppConfig {
  /**
   * Hide the electron menu bar (works only on Linux and Windows)
   * By default the menu bar should be hidden, but you can make
   * it visible with the Alt key.
   * Set this option to true to completely remove it.
   */
  static hideMenu: boolean = false;

  /**
   * The initial height of the application window.
   * This way you can adjust the window to your screens size.
   * Can not be set smaller then 320...
   */
  static windowHeight: number = 440;

  /**
   * The initial width of the application window.
   * This way you can adjust the window to your screens size.
   * Can not be set smaller then 320...
   */
  static windowWidth: number = 320;

  /**
   * Define if the application window should be opened in
   * fullscreen mode (true) or as a regular window (false).
   */
  static windowMode: 'normal' | 'maximized' | 'fullscreen' = 'normal';
}