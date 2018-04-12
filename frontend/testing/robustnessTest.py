from selenium import webdriver
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.select import Select 
from selenium.webdriver.common.by import By
import unittest, time, random

preButtonError = "submit button should be disabled before form is filled"
postButtonError = "submit button should be enabled after form is filled"
formResetError = "form input fields did not revert to ng-pristine after refreshing "

# checks that instructors cannot access pages (viewappeal, user) that require user rights 
# checks that instructors cannot delete announcements 
# checks that instructors cannot delete events 

class RobustnessTest(unittest.TestCase):

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

    # ensure appeals page is not accessible
    def test_view_appeal(self):
        driver = self.driver
        driver.get("http://localhost:4200/viewappeal")

        headers = driver.find_elements_by_tag_name("h5")
        self.assertNotIn("Appeals", headers)
        self.assertIn("Announcements", headers)

    # ensure add users form is not accessible
    def test_add_users(self):
        driver = self.driver
        driver.get("http://localhost:4200/user")

        headers = driver.find_elements_by_tag_name("h5")
        self.assertNotIn("Create a new Administrator/Instructor", headers)
        self.assertIn("Announcements", headers)

        buttons = driver.find_elements_by_id("submitFormButton")
        self.assertEqual(len(buttons), 0)

    # ensure add schedule form is not accessible
    def test_add_schedules(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules")

        headers = driver.find_elements_by_tag_name("h5")
        self.assertNotIn("Add a new Schedule", headers)
        self.assertIn("All Schedules", headers)

        buttons = driver.find_elements_by_id("addScheduleSubmitButton")
        self.assertEqual(len(buttons), 0)

    # ensure add schedule form is not accessible
    def test_delete_schedules(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules")

        buttons = driver.find_elements_by_tag_name("buttons") 
        titles = []
        for button in buttons:
            titles.append(button.getAttribute('title'))
        self.assertNotIn("Delete this schedule", titles)

    # ensure delete announcements button is not accessible
    def test_delete_announcements(self):
        driver = self.driver
        driver.get("http://localhost:4200/home")

        buttons = driver.find_elements_by_tag_name("button")
        titles = []
        for button in buttons:
            titles.append(button.getAttribute('title'))
        self.assertNotIn("Delete this announcement", titles)

    # ensure make announcements button is not accessible
    def test_make_announcements(self):
        driver = self.driver
        driver.get("http://localhost:4200/home")

        buttons = driver.find_elements_by_id("makeAnnouncementBtn")
        self.assertEqual(len(buttons), 0)

    # ensure events form is not accessible
    def test_add_events(self):
        driver = self.driver
        driver.get("http://localhost:4200/schedules/31")

        buttons = driver.find_elements_by_id("schedulesTitle")
        self.assertEqual(len(buttons), 0)

        buttons = driver.find_elements_by_id("submitEventButton")
        self.assertEqual(len(buttons), 0)

    # ensure delete events button is not accessible
    def test_delete_events(self):
        driver = self.driver
        driver.get("http://localhost:4200/events/25")

        buttons = driver.find_elements_by_tag_name("button")
        titles = []
        for button in buttons:
            titles.append(button.getAttribute('title'))
        self.assertNotIn("Delete this event", titles)

    def test_calendar_radio_buttons(self):
        driver = self.driver
        driver.get("http://localhost:4200/viewschedule")

        inputs = driver.find_elements_by_tag_name("input")
        types = []
        for button in buttons:
            types.append(button.getAttribute('type'))
        self.assertNotIn("radio", types)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()