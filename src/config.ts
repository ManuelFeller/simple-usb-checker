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

  /**
   * Define in what way the type of a detected events is displayed.
   * On most systems 'emoji' should work nice, but on Raspbian they do
   * not show up properly, so you may want to set it to 'text' there...
   * Also, if you have issues to distinguish red and green this can help.
   */
  static eventDisplayMethod: 'emoji' | 'text' = 'emoji';
}