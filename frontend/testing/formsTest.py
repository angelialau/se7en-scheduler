from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time

class FormsTest(unittest.TestCase):

    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--explicitly-allowed-ports=6666')
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)

    def test_add_user(self):
        driver = self.driver
        driver.get("http://localhost:4200/create-user")
        self.assertEqual("Create a new Administrator/Instructor", driver.find_element_by_id("createUserFormTitle").text)
        try:    
            select = driver.find_element_by_id("pillar")
            options = select.find_elements_by_tag_name("option")
            for option in options:
                if(option.text=="ISTD"):
                    option.click()
                    break
            name = driver.find_element_by_id("name")
            name.send_keys("Add User Selenium Test")

            email = driver.find_element_by_id("email")
            email.send_keys("selenium@sutd.edu.sg")

            phone = driver.find_element_by_id("phone")
            phone.send_keys("63036662")

            password = driver.find_element_by_id("password")
            password.send_keys("password")

            submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'submitFormButton')))
            self.assertEqual(submit.is_enabled(), True, "add user form button not enabled")
            time.sleep(5)
            
            # submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'submitFormButton'))).click()
            # snackbar = WebDriverWait(driver, 10).until(EC.visibility_of_element_located(driver.find_element_by_tag_name("simple-snack-bar")))
            # snackbarText = snackbar.text.strip()
            # assert "User account created" in snackbarText
            
        except NoSuchElementException as e: 
            print("Seems like element is not found: ")
            print(e)

    def test_add_course(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules/4")
        self.assertEqual("Courses under this Schedule", driver.find_element_by_id("pageTitle").text)
        try:
            showFormButton = driver.find_element_by_id("showFormButton").click()

            select = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.ID,"courseDetail")))
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

            submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'addCourseSubmitButton')))
            self.assertEqual(submit.is_enabled(), True, "add course form button not enabled")
            time.sleep(3)
        except NoSuchElementException as e: 
            print("Seems like element is not found: ")
            print(e)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()