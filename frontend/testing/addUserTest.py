from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import time

# Create a new instance of the Firefox driver
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--explicitly-allowed-ports=6666')
driver = webdriver.Chrome(chrome_options=chrome_options)

# go to the google home page
driver.get("http://localhost:4200/create-user")

try:    
    select = driver.find_element_by_id("pillar")
    options = select.find_elements_by_tag_name("option")
    for option in options:
        if(option.text=="ISTD"):
            option.click()
            break
    name = driver.find_element_by_id("name")
    name.send_keys("Sun Jun")

    email = driver.find_element_by_id("email")
    email.send_keys("sunjun@sutd.edu.sg")

    phone = driver.find_element_by_id("phone")
    phone.send_keys("63036662")

    password = driver.find_element_by_id("password")
    password.send_keys("password")

    submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'submitFormButton'))).click()
    
except NoSuchElementException as e: 
    print("Seems like element is not found: ")
    print(e)
finally:
    time.sleep(60)
    driver.quit()