from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time, pickle

preButtonError = "submit button should be disabled before form is filled"
postButtonError = "submit button should be enabled after form is filled"
formResetError = "form input fields did not revert to ng-pristine after refreshing "

def broken_function():
    raise Exception('This is broken')

class FormsInstructorTest(unittest.TestCase):

    def setUp(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--explicitly-allowed-ports=6666')
        self.driver = webdriver.Chrome(options=chrome_options)
        # login
        self.driver.implicitly_wait(10)
        self.driver.get("http://localhost:4200/login")
    
        email = self.driver.find_element_by_id("email")
        email.send_keys("oka_kurniawan@sutd.edu.sg")

        password = self.driver.find_element_by_id("password")
        password.send_keys("password")

        button = self.driver.find_element_by_tag_name("button").click() 
        header = WebDriverWait(self.driver,10).until(
            EC.visibility_of_element_located((By.ID, 'logoutButton')))

    # def test_make_announcement(self):
    #     driver = self.driver
    #     driver.find_element_by_id("makeAnnouncementBtn")
    #     with self.assertRaises(NoSuchElementException) as context:
    #         broken_function()

    #     self.assertTrue('This is broken' in context.exception)


    # def test_add_user(self):
    #     driver = self.driver
    #     driver.find_element_by_id("sbAddUser")
    #     with self.assertRaises(NoSuchElementException) as context:
    #         broken_function()

    #     self.assertTrue('This is broken' in context.exception)        

    def test_add_schedule(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules")

        div = driver.find_element_by_id("scheduleFormTitle").click()

        trimester = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "trimester")))
        trimesteroptions = trimester.find_elements_by_tag_name("option")
        for option in trimesteroptions:
            if "Trimester 3" in option.text:
                option.click()

        year = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "year")))
        yearoptions = year.find_elements_by_tag_name("option")
        for option in yearoptions:
            if "2023" in option.text:
                option.click()

        submit = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "addScheduleSubmitButton")))
        self.assertEqual(submit.is_enabled(), True, "add schedule form button not enabled")

        #test reset function
        driver.find_element_by_id("addSchedResetButton").click()
        #check that input fields revert to the pristine state
        trimester = WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.ID, "trimester")))
        self.assertEqual("ng-pristine" in trimester.get_attribute("class"), True, formResetError) 

    def test_add_course(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules/31")
        showFormButton = driver.find_element_by_id("courseFormTitle").click()

        submit = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, 'addCourseSubmitButton')))
        self.assertEqual(submit.is_enabled(), False, preButtonError)

        select = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.ID,"courseDetail")))
        options = select.find_elements_by_tag_name("option")
        for option in options:
            if(option.text.strip()=="EPD Term 7 - 30.114 Advanced Feedback and Control"):
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
        
        prof1 = driver.find_element_by_xpath('//select[@formcontrolname="id"]')
        prof1options = prof1.find_elements_by_tag_name("option")
        for option in prof1options:
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

        checkbox = driver.find_element_by_id("checkbox")
        checkbox.click()

        submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'addCourseSubmitButton')))
        self.assertEqual(submit.is_enabled(), True, postButtonError)

        driver.find_element_by_id("resetCourseButton").click()
        dropdown = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'courseDetail')))
        self.assertEqual("ng-pristine" in dropdown.get_attribute("class"), True, formResetError) 

    def test_add_appeal(self):
        driver = self.driver
        driver.get('http://localhost:4200/viewschedule')
        button = driver.find_element_by_id('appealButton')
        button.click()

        select = WebDriverWait(driver,10).until(EC.visibility_of_element_located((By.ID,"title")))
        options = select.find_elements_by_tag_name("option")
        options[0].click()

        content = driver.find_element_by_id('appealContent')
        content.send_keys("hello")

        submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'makeAppealButton')))
        self.assertEqual(submit.is_enabled(), True, postButtonError)

    # def test_change_password(self):
    #     driver = self.driver
    #     driver.get('http://localhost:4200/password')

    #     oldP = driver.find_element_by_id('oldPassword')
    #     oldP.send_keys("password")

    #     newP = driver.find_element_by_id('newPassword')
    #     newP.send_keys("password")

    #     confirmP = driver.find_element_by_id('confirmPassword')
    #     confirmP.send_keys("password") 

    #     submit = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, 'submitChangePasswordFormButton')))
    #     self.assertEqual(submit.is_enabled(), True, postButtonError)

    # add event

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()