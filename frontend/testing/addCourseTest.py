from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import time

# Create a new instance of the Firefox driver
# profile = webdriver.FirefoxProfile()
# profile.set_preference("network.security.ports.banned.override", 6666)
# driver = webdriver.Firefox(profile)

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--explicitly-allowed-ports=6666')
driver = webdriver.Chrome(chrome_options=chrome_options)

# go to the google home page
driver.get("http://localhost:4200/schedules/courses/add")

try:    
    select = driver.find_element_by_id("courseDetail")
    options = select.find_elements_by_tag_name("option")
    for option in options:
        if(option.text.strip()=="50.001 Introduction to Information Systems & Programming"):
            option.click()
            break
    
    core = driver.find_element_by_id("core")
    core.click()

    no_classes = driver.find_element_by_id("no_classes")
    no_classesOptions = no_classes.find_elements_by_tag_name("option")
    for option in no_classesOptions:
        if(option.text.strip()=="4"):
            option.click()
            break

    class_size = driver.find_element_by_id("class_size")
    class_sizeOptions = class_size.find_elements_by_tag_name("option")
    for option in class_sizeOptions:
        if(option.text.strip()=="3"):
            option.click()
            break

    prof1 = driver.find_element_by_xpath('//select[@formcontrolname="name"]')
    prof1options = prof1.find_elements_by_tag_name("option")
    for option in prof1options:
        print(option.text.strip())
        if "ISTD - Oka Kurniawan" in option.text:
            option.click()

    class_types = driver.find_element_by_xpath('//select[@formcontrolname="class_types"]')
    class_typesoptions = class_types.find_elements_by_tag_name("option")
    for option in class_typesoptions:
        if "Lecture" in option.text:
            option.click()  

    sessions_hrs = driver.find_element_by_xpath('//select[@formcontrolname="sessions_hrs"]')
    sessions_hrsoptions = sessions_hrs.find_elements_by_tag_name("option")
    for option in sessions_hrsoptions:
        if "2.5" in option.text:
            option.click()    

    submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'addCourseSubmitButton'))).click()
    
except NoSuchElementException as e: 
    print("Seems like element is not found: ")
    print(e)
finally:
    time.sleep(60)
    driver.quit()