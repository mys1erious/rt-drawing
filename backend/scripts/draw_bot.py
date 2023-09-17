from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import time
import random


TEST_URL = 'http://localhost:3000/drawing/test1'


def draw_random_line(canvas, action, start_x, start_y, move_x, move_y):
    action.click_and_hold(canvas) \
        .move_by_offset(start_x, start_y) \
        .move_by_offset(move_x, move_y) \
        .release()
    action.perform()


if __name__ == '__main__':
    driver = webdriver.Chrome()
    driver.get(TEST_URL)

    canvas = driver.find_element(By.CSS_SELECTOR, 'canvas')

    action = ActionChains(driver)

    time.sleep(0.1)

    # draw_random_line(canvas, action, 0, 0, 100, 100)
    # time.sleep(100)

    while True:
        # start_x = random.randint(0, 800)
        # start_y = random.randint(0, 600)
        start_x = 0
        start_y = 0
        end_x = random.randint(-400, 400)
        end_y = random.randint(-300, 300)
        draw_random_line(canvas, action, start_x, start_y, end_x, end_y)
        # time.sleep(random.uniform(0.5, 2))
        time.sleep(random.uniform(0.1, 1))
