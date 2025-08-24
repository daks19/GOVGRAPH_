import pyautogui
import time
import pygetwindow as gw

pycharm_title = "Visual Studio Code"  # or match your exact window title

def get_active_window():
    try:
        return gw.getActiveWindow()
    except:
        return None

def focus_window_by_title(title):
    windows = gw.getWindowsWithTitle(title)
    return windows[0] if windows else None

while True:
    current_window = get_active_window()
    pycharm_window = focus_window_by_title(pycharm_title)

    if pycharm_window:
        try:
            pycharm_window.activate()
            time.sleep(1)  # Let PyCharm become active

            pyautogui.typewrite("h         ")
            pyautogui.press("backspace")
            pyautogui.hotkey("ctrl", "s")  # Save to trigger WakaTime

            time.sleep(0.5)

            # Return to the previous window
            if current_window:
                current_window.activate()
        except Exception as e:
            print(f"Error: {e}")

    time.sleep(120)  # Wait 2 minutesh        h    h            h        h     h           